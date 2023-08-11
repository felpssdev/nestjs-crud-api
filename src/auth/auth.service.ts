import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

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
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });

    // Return the saved user
    return { user };
  }
  signIn() {
    return { message: 'I am signin in!' };
  }
}
