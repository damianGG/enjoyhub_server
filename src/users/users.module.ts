import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'tajnyKlucz', // Użyj swojego sekretu JWT
      signOptions: { expiresIn: '1h' }, // Opcjonalne ustawienia wygaśnięcia
    }),
    // Możesz tu dodać inne moduły, jeśli są potrzebne
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService],
  exports: [UsersService, TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
