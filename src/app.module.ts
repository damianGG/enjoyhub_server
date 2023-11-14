import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenueModule } from './venue/venue.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // replace with your DB host
      port: 3306, // replace with your DB port
      username: 'root', // replace with your DB username
      password: 'test', // replace with your DB password
      database: 'sys',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    VenueModule,
    UsersModule,
    AuthModule,
    CloudinaryModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
