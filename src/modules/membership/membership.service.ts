import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';
import { CreateMembershipDto } from 'src/modules/membership/dtos/create-membership.dto';
import { Membership } from 'src/modules/membership/entity/membership.entity';
import { Users } from 'src/modules/users/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership) private membershipRepo: Repository<Membership>,
    @InjectRepository(Users) private userRepo: Repository<Users>
  ) {}

  async createMembership(createMembershipDto: CreateMembershipDto) {
    try {
      // Kiem tra xem co user hay khong
      const result = await this.userRepo.findOne({
        where: {
          id: createMembershipDto.id_user
        }
      })
      console.log("Inside existingUser", result)
      if(result === null) {
        throw error
      }

      // Tao membership
      await this.membershipRepo
        .createQueryBuilder()
        .insert()
        .into('membership')
        .values(createMembershipDto)
        .execute()
      return {
        message: "Membership created successfully"
      }
    } catch (error) {
      return error;
    }
  }
}
