import { IsArray, IsDate, IsDateString, IsInt, IsNotEmpty, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class RentalBookItemDto {
  @IsInt()
  @IsNotEmpty()
  book_id: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsDateString()
  @IsNotEmpty()
  date_rented: string;

  @IsDateString()
  @IsNotEmpty()
  due_date: string;
}

export class CreateRentalDto {

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RentalBookItemDto)
  books: RentalBookItemDto[];
}
