import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query, Req } from '@nestjs/common';
import { BooksService } from 'src/modules/books/books.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { Roles } from 'src/helpers/roles.decorator';
import { UserRole } from 'src/modules/users/entity/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { CreateRentalDto } from 'src/modules/rental/dtos/create-rental.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'API để xem danh sách các sách' })
  @Get() // [GET] /books
  findAll() {
    return this.booksService.findAll();
  }

  @ApiOperation({ summary: 'API để tìm sách' })
  @Get('/search') // [GET] books/search/query=''
  searchBook(
    @Query('query') query: string
  ) {
    return this.booksService.searchBook(query);
  }

  @ApiOperation({ summary: 'API để tìm sách theo ID' })
  @Get(':id') // [GET] /books/:id
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'API để tạo sách mới (Chỉ ADMIN)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post() // [POST] /books
  create(@Body() createBookDto: CreateBookDto[]) {
    console.log(`Inside [POST] /books`)
    return this.booksService.create(createBookDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'API để cập nhật thông tin sách (Chỉ ADMIN)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id') // [PUT] /books/:id
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    console.log(`Inside [PUT] /books. ${updateBookDto.title}`)
    return this.booksService.update(+id, updateBookDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'API để xóa sách (Chỉ ADMIN)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'API để mượn sách (Chỉ người dùng)' })
  @ApiResponse({ status: 400, description: 'You have pending rentals. Please complete or cancel them before creating a new rental.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post('/rent')
  rentBook(@Req() req, @Body() createRentalDto: CreateRentalDto) {
    // console.log(req.user.sub);
    return this.booksService.rentBook(req.user.sub, createRentalDto);
  }
}
