import { IsNotEmpty, IsDateString } from "class-validator";

export class CreateMembershipDto {
  @IsNotEmpty()
  id_user: number;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

}
