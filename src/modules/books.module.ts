import { Module } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { BooksController } from 'src/controllers/books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from 'src/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Books])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
