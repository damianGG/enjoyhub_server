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
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      // type: 'mysql',
      // host: 'localhost', // replace with your DB host
      // port: 3306, // replace with your DB port
      // username: 'root', // replace with your DB username
      // password: 'test', // replace with your DB password
      // database: 'sys',
      // entities: ['dist/**/*.entity{.ts,.js}'],
      // synchronize: true,
      type: 'mysql',
      host: process.env.DATABASE_HOST, // replace with your DB host
      port: 3306, // replace with your DB port
      username: process.env.DATABASE_USERNAME, // replace with your DB username
      password: process.env.DATABASE_PASSWORD, // replace with your DB password
      database: process.env.DATABASE_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    VenueModule,
    UsersModule,
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
