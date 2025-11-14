import { IsNotEmpty, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMembershipDto {
  @ApiProperty({ description: 'ID of the user to create membership for', example: 5 })
  @IsNotEmpty()
  id_user: number;

  @ApiProperty({ description: 'Membership start date', example: '2023-12-20', type: String, format: 'date' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ description: 'Membership end date', example: '2025-12-20', type: String, format: 'date' })
  @IsDateString()
  end_date: string;

}
