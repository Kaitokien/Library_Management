import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody, ApiResponse } from "@nestjs/swagger";
import { CreateMembershipDto } from "src/modules/membership/dtos/create-membership.dto";
import { UserRole } from "src/modules/users/entity/user.entity";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/role.guard";
import { Roles } from "src/helpers/roles.decorator";
import { MembershipService } from "src/modules/membership/membership.service";

@ApiTags('Membership')
@ApiBearerAuth('JWT-auth')
@Controller('membership')
export class MembershipController {
  constructor(private membershipService: MembershipService) {}

  @ApiOperation({ summary: 'Tạo membership mới cho user' })
  @ApiBody({ type: CreateMembershipDto })
  @ApiResponse({ status: 201, description: 'Membership created successfully' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Post('new')
  createMembership(@Body() createMembership: CreateMembershipDto) {
    return this.membershipService.createMembership(createMembership);
  }

}