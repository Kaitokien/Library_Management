import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from 'src/modules/membership/entity/membership.entity';
import { MembershipController } from 'src/modules/membership/membership.controller';
import { MembershipService } from 'src/modules/membership/membership.service';
import { Users } from 'src/modules/users/entity/user.entity';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Membership]),
    TypeOrmModule.forFeature([Users]), 
    UsersModule,
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}
