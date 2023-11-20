import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Param,
  Res,
  UseInterceptors,
  UploadedFiles,
  Req,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  //@UseGuards(LocalAuthGuard)
  @Post('auth/login-google')
  async generateToken(@Body() body: { email: string }) {
    const { email } = body;
    return this.authService.generateToken(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    const { id, email } = req.user;
    return { id, email };
  }

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
  @Post('image/upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return Promise.all(
      files.map((file) => this.cloudinaryService.uploadFile(file)),
    );
  }
}
