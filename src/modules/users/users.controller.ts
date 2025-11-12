import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'API để người dùng xem thông tin tài khoản' })
  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.sub)
  }

  @ApiOperation({ summary: 'API để người dùng chỉnh sửa thông tin tài khoản' })
  @UseGuards(AuthGuard)
  @Put('profile')
  updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.sub, updateUserDto);
  }
}
