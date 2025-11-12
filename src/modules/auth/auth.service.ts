import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { Users } from 'src/modules/users/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginDto } from '../users/dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';

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
    if(createUserDto.role === 'EMPLOYEE') {
      return {
        message: "You are not authorized to create an Employee. Please contact the Admin for details!"
      }
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const new_user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })
    
    await this.userRepository.save(new_user);
    console.log('Created new user successfully')
    return {
    message: 'User registered successfully',
    user: {
      id: new_user.id,
      email: new_user.email,
      role: new_user.role,
    },
  };
  }

  async login(loginDto: LoginDto) {
    const email = loginDto.email;
    const password = loginDto.password;
    
    const user = await this.findOneByEmail(email);
    if(!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return {
        message: "Sai email hoac mat khau!"
      }
    }

    const payload = { 
      sub: user.id, 
      username: user.username,
      email: user.email,
      role: user.role
    };
    return {
      message: 'Login successfully',
      access_token: await this.jwtService.signAsync(payload)
    }
  }

  async createEmployee(createEmployee: CreateUserDto) {
    const existingUser = await this.findOneByEmail(createEmployee.email);
    
    if(existingUser) {
      throw new ConflictException('Email or username already exists');
    }
    if(createEmployee.role !== 'EMPLOYEE') {
      return {
        message: 'Please create an Employee!'
      }
    }
    const hashedPassword = await bcrypt.hash(createEmployee.password, 10);
    const new_user = this.userRepository.create({
      ...createEmployee,
      password: hashedPassword,
    })
    
    await this.userRepository.save(new_user);
    return {
      message: "Employee created successfully!"
    }
  }
}
