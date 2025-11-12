import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BooksModule } from './modules/books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './modules/users/entity/user.entity';
import { CategoryModule } from './modules/category/category.module';
import { Books } from './modules/books/entity/book.entity';
import { Category } from './modules/category/entity/category.entity';
import { MembershipModule } from './modules/membership/membership.module';
import { Membership } from 'src/modules/membership/entity/membership.entity';
import { Rental } from 'src/modules/rental/entity/rental.entity';
import { RentalBook } from 'src/modules/rental/entity/rental_book.entity';
import { RentalModule } from './modules/rental/rental.module';

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
    AuthModule, UsersModule, BooksModule, CategoryModule, MembershipModule, RentalModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
