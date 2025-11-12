import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/users/entity/user.entity';
import { RentalController } from 'src/modules/rental/rental.controller';
import { RentalService } from 'src/modules/rental/rental.service';
import { Rental } from 'src/modules/rental/entity/rental.entity';
import { RentalBook } from 'src/modules/rental/entity/rental_book.entity';
import { Books } from 'src/modules/books/entity/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Rental, RentalBook, Books]),
  ],
  controllers: [RentalController],
  providers: [RentalService],
})
export class RentalModule {}
