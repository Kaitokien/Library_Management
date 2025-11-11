import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsDateString } from "class-validator";

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  categoryid: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  isbn: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  publisheddate: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stock: number
}
