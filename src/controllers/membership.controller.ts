import { Controller, Post, Body } from "@nestjs/common";
import { CreateMembershipDto } from "src/dtos/membership/create-membership.dto";
import { CreateUserDto } from "src/dtos/users/create-user.dto";
import { MembershipService } from "src/services/membership.service";

@Controller('membership')
export class MembershipController {
  constructor(private membershipService: MembershipService) {}

  @Post('new')
  createMembership(/*@Body() createMembership: CreateMembershipDto*/) {
    console.log('Inside /membership/new')
    // return this.membershipService.createMembership();
  }

}