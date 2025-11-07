import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from 'src/entities/membership.entity';
import { MembershipController } from 'src/controllers/membership.controller';
import { MembershipService } from 'src/services/membership.service';
@Module({
  imports: [TypeOrmModule.forFeature([Membership])],
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}
