import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  public async findByVerificationToken(token: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // this will throw an error if the user is not found
    const updatedUser = Object.assign(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id); // this will throw an error if the user is not found
    await this.userRepository.remove(user);
  }
  async register(createUserDto: CreateUserDto): Promise<User> {
    // Sprawdzenie, czy użytkownik o podanym emailu już istnieje
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hashowanie hasła przed zapisaniem do bazy danych
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    //Tworzenie nowego uuid do weryfikacji adresu email
    const _emailVerificationToken = uuidv4();
    // Tworzenie nowego użytkownika i zapisanie go w bazie danych
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      emailVerificationToken: _emailVerificationToken,
    });
    await this.mailService.sendVerificationEmail(
      user.email,
      user.emailVerificationToken,
    );
    return await this.userRepository.save(user);
  }

  async registerViaProvider(createUserDto: CreateUserDto): Promise<any> {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      // Jeśli użytkownik już istnieje, możesz zdecydować, czy zwrócić istniejący token JWT,
      // czy też po prostu zwrócić komunikat, że użytkownik już istnieje.
      // Na przykład, możesz wygenerować nowy token JWT dla istniejącego użytkownika:
      const payload = { email: existingUser.email, sub: existingUser.id };
      return {
        access_token: this.jwtService.sign(payload),
        email: existingUser.email,
        name: existingUser.name,
        userId: existingUser.id,
      };
    }

    // Tworzenie nowego użytkownika i zapisanie go w bazie danych
    const user = this.userRepository.create({
      ...createUserDto,
      // Dodatkowe ustawienia dla użytkownika, jeśli są potrzebne
    });

    await this.userRepository.save(user);

    // Generowanie tokena JWT dla nowego użytkownika
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      email: user.email,
      name: user.name,
      userId: user.id,
    };
  }
}
