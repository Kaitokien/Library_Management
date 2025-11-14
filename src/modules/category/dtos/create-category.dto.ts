import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator"
import { Column } from "typeorm"

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Fantasy',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    example: 'A genre of speculative fiction set in a fictional universe, often inspired by real world myth and folklore.',
    required: false
  })
  @IsString()
  description: string
}

export class CreateCategoryDtoArray {

  @ApiProperty({ type: [CreateCategoryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  categories: CreateCategoryDto[];
}
