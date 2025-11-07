import { IsNotEmpty, IsString, IsNumber, IsDateString } from "class-validator";

export class CreateBookDto {
  @IsNotEmpty()
  @IsNumber()
  categoryid: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  isbn: string;

  @IsNotEmpty()
  @IsDateString()
  publisheddate: string

  @IsNotEmpty()
  @IsNumber()
  stock: number
}
