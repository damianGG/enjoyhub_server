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
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
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
  @Post('image/upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return Promise.all(
      files.map((file) => this.cloudinaryService.uploadFile(file)),
    );
  }
}
