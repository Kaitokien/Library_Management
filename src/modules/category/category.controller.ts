import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from 'src/modules/category/category.service';
import { CreateCategoryDto, CreateCategoryDtoArray } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/helpers/roles.decorator';
import { UserRole } from 'src/modules/users/entity/user.entity';
import { ApiOperation, ApiTags, ApiBody, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'API liệt kê tất cả các danh mục' })
  @ApiResponse({ status: 200, description: 'Danh sách danh mục' })
  @Get() // [GET] /categories
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'API để tìm danh mục theo ID' })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  @ApiResponse({ status: 200, description: 'Thông tin danh mục' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @Get(':id') // [GET] /categories/:id
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @ApiOperation({ summary: 'API để tạo danh mục mới (Chỉ ADMIN)' })
  @ApiBody({ type: CreateCategoryDtoArray })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: 'Category created' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post() // [POST] /categories
  create(@Body() createCategoryDto: CreateCategoryDtoArray) {
    // pass the validated array to the service
    return this.categoryService.create(createCategoryDto.categories);
  }

  @ApiOperation({ summary: 'API để chỉnh danh mục (Chỉ ADMIN)' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID của danh mục cần cập nhật' })
  @ApiResponse({ status: 200, description: 'Category has been updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiBody({ type: UpdateCategoryDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id') // [PUT] /categories/:id
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'API để xóa danh mục (Chỉ ADMIN)' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID của danh mục cần xóa' })
  @ApiResponse({ status: 200, description: 'Category has been deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id') // [DELETE] /categories/:id
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
