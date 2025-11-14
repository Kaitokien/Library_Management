import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query, Req } from '@nestjs/common';
import { BooksService } from 'src/modules/books/books.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { Roles } from 'src/helpers/roles.decorator';
import { UserRole } from 'src/modules/users/entity/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { CreateRentalDto } from 'src/modules/rental/dtos/create-rental.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'API để xem danh sách các sách' })
  @ApiResponse({ status: 200, description: 'Danh sách sách trả về' })
  @Get() // [GET] /books
  findAll() {
    return this.booksService.findAll();
  }

  @ApiOperation({ summary: 'API để tìm sách' })
  @ApiQuery({ name: 'query', required: false, description: 'Từ khóa tìm kiếm (title, author)' })
  @ApiResponse({ status: 200, description: 'Kết quả tìm kiếm' })
  @Get('/search') // [GET] books/search/query=''
  searchBook(
    @Query('query') query: string
  ) {
    return this.booksService.searchBook(query);
  }

  @ApiOperation({ summary: 'API để tìm sách theo ID' })
  @ApiParam({ name: 'id', description: 'ID của sách' })
  @ApiResponse({ status: 200, description: 'Thông tin sách' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @Get(':id') // [GET] /books/:id
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'API để tạo sách mới (Chỉ ADMIN)' })
  @ApiBody({ type: CreateBookDto, isArray: true })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: 'Books created successfully' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post() // [POST] /books
  create(@Body() createBookDto: CreateBookDto[]) {
    console.log(`Inside [POST] /books`)
    return this.booksService.create(createBookDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'API để cập nhật thông tin sách (Chỉ ADMIN)' })
  @ApiBody({ type: UpdateBookDto })
  @ApiParam({ name: 'id', description: 'ID của sách cần cập nhật' })
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id') // [PUT] /books/:id
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    console.log(`Inside [PUT] /books. ${updateBookDto.title}`)
    return this.booksService.update(+id, updateBookDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'API để xóa sách (Chỉ ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID của sách cần xóa' })
  @ApiResponse({ status: 200, description: 'Book removed successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'API để mượn sách (Chỉ người dùng)' })
  @ApiResponse({ status: 400, description: 'You have pending rentals. Please complete or cancel them before creating a new rental.' })
  @ApiBody({ type: CreateRentalDto })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post('/rent')
  rentBook(@Req() req, @Body() createRentalDto: CreateRentalDto) {
    // console.log(req.user.sub);
    return this.booksService.rentBook(req.user.sub, createRentalDto);
  }
}
