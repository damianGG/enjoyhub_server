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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
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
}
