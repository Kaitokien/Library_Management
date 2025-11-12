import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { RentalBookStatus } from "src/entities/rental_book.entity";

export class UpdateRentalBookStatusDto {
  @ApiProperty({
    description: 'New status for the rental book',
    enum: RentalBookStatus,
    example: 'BORROWED',
  })
  @IsEnum(RentalBookStatus)
  status: RentalBookStatus;

  @ApiProperty({
    description: 'Return date (required when status is RETURNED)',
    example: '2025-11-15',
    required: false,
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  returned_at?: string;
}
