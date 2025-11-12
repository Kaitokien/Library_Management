import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { LoginDto } from "../users/dtos/login-user.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/role.guard";
import { Roles } from "src/helpers/roles.decorator";
import { UserRole } from "src/modules/users/entity/user.entity";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'API để đăng ký tài khoản mới' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @ApiOperation({ summary: 'API để đăng nhập tài khoản' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'Login successfully' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    console.log(`Inside /auth/login. The data is ${loginDto}`)
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'API để tạo tài khoản nhân viên (chỉ quản trị viên truy cập được)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('create-employee')
  createEmployee(@Body() createUserDto: CreateUserDto) {
    return this.authService.createEmployee(createUserDto);
  }
}