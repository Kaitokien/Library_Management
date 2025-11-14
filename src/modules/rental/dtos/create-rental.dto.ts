import { IsArray, IsDate, IsDateString, IsInt, IsNotEmpty, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class RentalBookItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  book_id: number;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: '2025-11-10', type: String, format: 'date' })
  @IsDateString()
  @IsNotEmpty()
  date_rented: string;

  @ApiProperty({ example: '2025-11-20', type: String, format: 'date' })
  @IsDateString()
  @IsNotEmpty()
  due_date: string;
}

export class CreateRentalDto {

  @ApiProperty({ type: [RentalBookItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RentalBookItemDto)
  books: RentalBookItemDto[];
}
