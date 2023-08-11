import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Injectable Decorator allows dependency injection, which
// is a programming technique that makes a class independent
// of its dependencies
@Injectable()
// Responsible for handling the business logic
export class AuthService {
  constructor(private prisma: PrismaService) { }
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

      delete user.hash;

      // Return the saved user
      return { user };
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

    // Return the user
    delete user.hash;
    return user;
  }
}
