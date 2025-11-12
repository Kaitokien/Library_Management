import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/user.entity';
import { RentalController } from 'src/controllers/rental.controller';
import { RentalService } from 'src/services/rental.service';
import { Rental } from 'src/entities/rental.entity';
import { RentalBook } from 'src/entities/rental_book.entity';
import { Books } from 'src/entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Rental, RentalBook, Books]),
  ],
  controllers: [RentalController],
  providers: [RentalService],
})
export class RentalModule {}
