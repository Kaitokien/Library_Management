import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "src/entities/user.entity";

export class CreateUserDto {
  @ApiProperty({
    example: 'Sponge Bob',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'spongebob@gmail.com',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    required: false,
    default: 'USER'
  })
  @IsOptional()
  @IsEnum(['ADMIN', 'USER', 'EMPLOYEE'], {
    message: 'Valid role required',
  })
  role?: UserRole;
}
