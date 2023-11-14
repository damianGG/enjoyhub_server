import {
  Controller,
  Get,
  Param,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { GoogleAuthGuard } from './guards/google-auth.guard';

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
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  @Redirect()
  async googleLogin() {
    // Passport wykona przekierowanie do Google
  }
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    // Obsługa przekierowania po zalogowaniu przez Google
    const { accessToken } = await this.authService.validateUserFromGoogle(
      req.user,
    );
    res.redirect(
      `http://localhost:3001/auth-success?accessToken=${accessToken}`,
    );
  }
}
