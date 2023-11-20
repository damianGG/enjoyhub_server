import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async verifyEmail(token: string): Promise<string> {
    const user = await this.userService.findByVerificationToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid verification link.');
    }

    user.emailVerified = true;
    await this.userService.update(user.id, user);

    return 'Email successfully verified';
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<any> {
    console.log('AuthService.login: user=' + JSON.stringify(user));
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload), //Zwracamy token po zalogowaniu, tutaj możliwe że będziemy musieli zwrócić jeszcze szereg innych rzeczy
    };
  }

  async loginGoogle(user: any): Promise<any> {
    console.log('AuthService.login: user=' + JSON.stringify(user));
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload), //Zwracamy token po zalogowaniu, tutaj możliwe że będziemy musieli zwrócić jeszcze szereg innych rzeczy
    };
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async validateUserFromGoogle(profile: any): Promise<{ accessToken: string }> {
    const email = profile.email;
    let user = await this.userService.findOneByEmail(email);

    if (!user) {
      // Jeśli użytkownik nie istnieje, tworzymy nowego użytkownika
      user = await this.userService.create({
        email: profile.email,
        name: profile.firstName,
        password: '',
      });
    } else {
      user = await this.userService.update(user.id, {});
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async generateToken(email: string): Promise<string> {
    // Tutaj możesz dodać logikę, która generuje token JWT tylko na podstawie adresu e-mail
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new Error('Użytkownik o podanym adresie e-mail nie istnieje');
    }

    const payload = { sub: user.id, email: user.email }; // Dowolne dane, które chcesz umieścić w tokenie
    return this.jwtService.sign(payload);
  }
}
