import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsDateString } from "class-validator";

export class CreateBookDto {
  @ApiProperty({
    example: 1,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  categoryid: number;

  @ApiProperty({
    example: 'Childhood',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Leo Tolstoy',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({
    example: '978-3-16-148410-0',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  isbn: string;

  @ApiProperty({
    example: '1852-01-01',
    required: true
  })
  @IsNotEmpty()
  @IsDateString()
  publisheddate: string

  @ApiProperty({
    example: 25,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  stock: number
}
