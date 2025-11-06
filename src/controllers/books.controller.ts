import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { BooksService } from 'src/services/books.service';
import { CreateBookDto } from 'src/dtos/create-book.dto';
import { UpdateBookDto } from 'src/dtos/update-book.dto';
import { Roles } from 'src/helpers/roles.decorator';
import { UserRole } from 'src/entities/user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get() // [GET] /books
  findAll() {
    return this.booksService.findAll();
  }

  @Get('/search')
  searchBook(
    @Query('query') query: string
  ) {
    return this.booksService.searchBook(query);
  }

  @Get(':id') // [GET] /books/:id
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post() // [POST] /books
  create(@Body() createBookDto: CreateBookDto[]) {
    console.log(`Inside [POST] /books`)
    return this.booksService.create(createBookDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id') // [PUT] /books/:id
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    console.log(`Inside [PUT] /books. ${updateBookDto.title}`)
    return this.booksService.update(+id, updateBookDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
