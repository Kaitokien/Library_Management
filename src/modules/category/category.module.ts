import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from 'src/modules/category/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/modules/category/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
