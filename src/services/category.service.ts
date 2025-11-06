import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/dtos/create-category.dto';
import { UpdateCategoryDto } from 'src/dtos/update-category.dto';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}
  async create(createCategoryDto: CreateCategoryDto[]) {
    try {
      await this.categoryRepository
        .createQueryBuilder()
        .insert()
        .into('category')
        .values(createCategoryDto)
        .execute()
        return {
          message: "Category created successfully!"
        }
    } catch (error) {
      return {
        message: "Fail to create category!"
      }
    }
  }

  async findAll() {
    const categories = await this.categoryRepository.find()
    return categories;
  }

  async findOne(id: number) {
    const result = await this.categoryRepository
      .createQueryBuilder('category')
      .where("category.id = :id", { id })
      .getOne()
    console.log(`Inside findOne function of category.service.`)
    if(result === null) {
      return {
        message: 'Cannot find category required. Please go back!'
      }
    }
    return result;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.categoryRepository
      .createQueryBuilder()
      .update('category')
      .set(updateCategoryDto)
      .where("id = :id", {id})
      .execute()
      return `Category with ID ${id} has been updated successfully!`;
    } catch (error) {
      return {
        error: error
      }
    }
  }

  async remove(id: number) {
    try {
      // Kiem tra xem sach co ton tai hay khong
      const result = await this.categoryRepository
      .createQueryBuilder('category')
      .where("category.id = :id", { id })
      .getOne()
      if(result === null) {
        return {
          message: `Category with ID ${id} cannot be found or has already been deleted`
        }
      }
      await this.categoryRepository
        .createQueryBuilder()
        .delete()
        .from(Category)
        .where("id = :id", { id })
        .execute()
      return `Category with ID ${id} has been deleted successfully!`;
    } catch (error) {
      return {
        error: error
      }
    }
  }
}
