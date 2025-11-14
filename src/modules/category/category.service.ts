import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from 'src/modules/category/entity/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}

  private async existingCategory(name: string) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where("category.name = :name", { name })
      .getOne()
    return category;
  }
  async create(createCategoryDto: CreateCategoryDto[]) {
    try {
      // check for existing categories by name to avoid duplicates
      for (const c of createCategoryDto) {
        const exists = await this.existingCategory(c.name);
        if (exists) {
          return {
            message: `Category with name ${c.name} already exists`
          }
        }
      }

      console.log('OK1');
      await this.categoryRepository
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values(createCategoryDto)
        .execute()
      
        console.log('OK2');
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
      throw new NotFoundException('Category not found');
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
      throw new NotFoundException('Category not found');
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
        throw new NotFoundException('Category not found')
      }
      await this.categoryRepository
        .createQueryBuilder()
        .delete()
        .from(Category)
        .where("id = :id", { id })
        .execute()
      return `Category with ID ${id} has been deleted successfully!`;
    } catch (error) {
      throw new NotFoundException('Category not found');
    }
  }
}
