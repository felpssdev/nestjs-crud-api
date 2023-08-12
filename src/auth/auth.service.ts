import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Injectable Decorator allows dependency injection, which
// is a programming technique that makes a class independent
// of its dependencies
@Injectable()
// Responsible for handling the business logic
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }
  async signUp(dto: AuthDto) {
    // Generate the password hash
    const hash = await argon.hash(dto.password);

    // Save the new user in the DB
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // Return the saved user's JWT token
      return this.signToken(user.id, user.email);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials already taken!');
        }
      }
      throw err;
    }
  }

  async signIn(dto: AuthDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // If user does not exists, throw exception
    if (!user) {
      throw new ForbiddenException('User not found!');
    }

    // Compare passwords
    const pwMatches = await argon.verify(user.hash, dto.password);

    // If passowrd incorrect, throw exception
    if (!pwMatches) {
      throw new ForbiddenException('Wrong credentials!');
    }

    // Return the JWT token
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
