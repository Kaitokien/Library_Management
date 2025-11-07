import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/users/create-user.dto';
import { UpdateUserDto } from 'src/dtos/users/update-user.dto';
import { Users } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findOne(id: number) {
    const user = await this.userRepository
      .createQueryBuilder()
      .select(["users.username", "users.email", "users.role"])
      .from(Users, "users")
      .where("users.id = :id", { id })
      .getOne()
    if(!user) {
      return {
        message: "User not found"
      }
    }
    // console.log(user)
    return user;
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto) {
    if(updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }
    if (updateUserDto.email) {
      const existing = await this.userRepository.findOneBy({ email: updateUserDto.email })
      if (existing && existing.id !== id) {
        return { message: 'This email exists. Please choose another appropriate one!' }
      }
    }
    await this.userRepository
      .createQueryBuilder()
      .update(Users)
      .set(updateUserDto)
      .where("id = :id", { id })
      .execute()
    return {
      message: 'Profile updated successfully!'
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
