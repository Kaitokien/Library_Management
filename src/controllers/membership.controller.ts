import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CreateMembershipDto } from "src/dtos/membership/create-membership.dto";
import { CreateUserDto } from "src/dtos/users/create-user.dto";
import { UserRole } from "src/entities/user.entity";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/role.guard";
import { Roles } from "src/helpers/roles.decorator";
import { MembershipService } from "src/services/membership.service";

@ApiBearerAuth()
@Controller('membership')
export class MembershipController {
  constructor(private membershipService: MembershipService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Post('new')
  createMembership(@Body() createMembership: CreateMembershipDto) {
    return this.membershipService.createMembership(createMembership);
  }

}