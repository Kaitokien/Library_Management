import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class LoginDto {
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
}