import { Injectable } from '@nestjs/common';

// Injectable Decorator allows dependency injection, which
// is a programming technique that makes a class independent
// of its dependencies
@Injectable()
// Responsible for handling the business logic
export class AuthService {
  signUp() {
    return { message: 'I am signin up!' };
  }
  signIn() {
    return { message: 'I am signin in!' };
  }
}
