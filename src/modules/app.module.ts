import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { UsersModule } from '../modules/users.module';
import { BooksModule } from '../modules/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { CategoryModule } from '../modules/category.module';
import { Books } from '../entities/book.entity';
import { Category } from '../entities/category.entity';
import { MembershipModule } from './membership.module';
import { Membership } from 'src/entities/membership.entity';
import { Rental } from 'src/entities/rental.entity';
import { RentalBook } from 'src/entities/rental_book.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: '123',
      username: 'postgres',
      entities: [Users, Books, Category, Membership, Rental, RentalBook],
      database: 'Library_DB',
      synchronize: false,
      logging: true,
    }), 
    AuthModule, UsersModule, BooksModule, CategoryModule, MembershipModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
