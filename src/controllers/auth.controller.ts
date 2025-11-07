import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { CreateUserDto } from "src/dtos/users/create-user.dto";
import { LoginDto } from "src/dtos/users/login-user.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/role.guard";
import { Roles } from "src/helpers/roles.decorator";
import { UserRole } from "src/entities/user.entity";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    console.log(`Inside /auth/login. The data is ${loginDto}`)
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('create-employee')
  createEmployee(@Body() createUserDto: CreateUserDto) {
    return this.authService.createEmployee(createUserDto);
  }
}