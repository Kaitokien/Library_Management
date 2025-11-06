import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { LoginDto } from "src/dtos/login-user.dto";

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
}