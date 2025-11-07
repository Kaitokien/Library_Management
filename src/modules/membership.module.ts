import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from 'src/entities/membership.entity';
import { MembershipController } from 'src/controllers/membership.controller';
import { MembershipService } from 'src/services/membership.service';
import { Users } from 'src/entities/user.entity';
import { UsersModule } from './users.module';
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
