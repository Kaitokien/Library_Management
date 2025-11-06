import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { Users } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginDto } from 'src/dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private jwtService: JwtService
  ) {}
  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    console.log(user)
    if(!user) {
      return null;
    }
    return user;
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    
    if(existingUser) {
      throw new ConflictException('Email or username already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const new_user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })
    
    await this.userRepository.save(new_user);
    console.log('Created new user successfully')
  }

  async login(loginDto: LoginDto) {
    console.log(loginDto)
    const email = loginDto.email;
    const password = loginDto.password;
    
    const user = await this.findOneByEmail(email);
    if(!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    const payload = { 
      sub: user.id, 
      username: user.username,
      email: user.email,
      role: user.role
    };
    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
