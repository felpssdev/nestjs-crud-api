import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

// /users
@Controller('users')
export class UserController {
  // Check JWT token guard
  @UseGuards(AuthGuard('jwt'))
  // /users/me
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }
}
