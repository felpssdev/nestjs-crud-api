import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

// Injectable Decorator allows dependency injection, which
// is a programming technique that makes a class independent
// of its dependencies
@Injectable()
// Responsible for handling the business logic
export class AuthService {
  constructor(private prisma: PrismaService) { }
  signUp(dto: AuthDto) {
    return { message: 'I am signin up!' };
  }
  signIn() {
    return { message: 'I am signin in!' };
  }
}
