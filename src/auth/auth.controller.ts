import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

// Responsible for handling requests
// /auth
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // /auth/signup
  @Post('signup')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp();
  }

  // /auth/signin
  @Post('signin')
  signIn() {
    return this.authService.signIn();
  }
}
