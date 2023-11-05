import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    const result = await this.authService.verifyEmail(token);

    if (result === 'Email successfully verified') {
      //  res.redirect('/login');
      console.log('Email successfully verified!');
    } else {
      res.redirect('/verification-failed');
    }
  }

  @Get('verify-token')
  verifyToken(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.verifyToken(token);
  }
}
