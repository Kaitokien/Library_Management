import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from 'src/services/category.service';
import { CreateCategoryDto } from 'src/dtos/category/create-category.dto';
import { UpdateCategoryDto } from 'src/dtos/category/update-category.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/helpers/roles.decorator';
import { UserRole } from 'src/entities/user.entity';
import { ApiOperation } from '@nestjs/swagger';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'API liệt kê tất cả các danh mục' })
  @Get() // [GET] /categories
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'API để tìm danh mục theo ID' })
  @Get(':id') // [GET] /categories/:id
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @ApiOperation({ summary: 'API để tạo danh mục mới (Chỉ ADMIN)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post() // [POST] /categories
  create(@Body() createCategoryDto: CreateCategoryDto[]) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'API để chỉnh danh mục (Chỉ ADMIN)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id') // [PUT] /categories/:id
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'API để xóa danh mục (Chỉ ADMIN)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id') // [DELETE] /categories/:id
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
