import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from 'src/dtos/books/create-book.dto';
import { UpdateBookDto } from 'src/dtos/books/update-book.dto';
import { Books } from 'src/entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Books) private bookRepository: Repository<Books>
  ) {}
  async create(createBookDto: CreateBookDto[]) {
    try {
      await this.bookRepository
        .createQueryBuilder()
        .insert()
        .into('books')
        .values(createBookDto)
        .execute();
        return {
          message: "Created successfully"
        }
    } catch (error) {
      return {
        error
      }
    }
  }

  async findAll() {
    const all_books = await this.bookRepository.find()
    return all_books;
  }

  async findOne(id: number) {
    const result = await this.bookRepository
      .createQueryBuilder('books')
      .where("books.id = :id", { id })
      .getOne()
    console.log(`Inside findOne function of book.service.`)
    if(result === null) {
      return {
        message: 'Cannot find book required. Please go back!'
      }
    }
    return result;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    try {
      const { isbn, ...data } = updateBookDto;
      const result = await this.bookRepository
      .createQueryBuilder()
      .update('books')
      .set(data)
      .where("id = :id", {id})
      .execute()
      return `Book with ID ${id} has been updated successfully!`;
    } catch (error) {
      return {
        error: error
      }
    }
  }

  async remove(id: number) {
    try {
      // Kiem tra xem sach co ton tai hay khong
      const result = await this.bookRepository
      .createQueryBuilder('books')
      .where("books.id = :id", { id })
      .getOne()
      if(result === null) {
        return {
          message: `Book with ID ${id} cannot be found or has already been deleted`
        }
      }
      await this.bookRepository
        .createQueryBuilder()
        .delete()
        .from(Books)
        .where("id = :id", { id })
        .execute()
      return `Book with ID ${id} has been deleted successfully!`;
    } catch (error) {
      return {
        error: error
      }
    }
  }

  async searchBook(query: string) {
    const result = await this.bookRepository
      .createQueryBuilder('books')
      .where('books.title ILIKE :query', { query: `%${query}%` })
      .orWhere('books.author ILIKE :query', { query: `%${query}%` })
      .getMany();
    return result;
  }
}
