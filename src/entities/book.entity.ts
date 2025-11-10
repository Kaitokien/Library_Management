import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsDate, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Category } from "src/entities/category.entity";
import { RentalBook } from "./rental_book.entity";

@Entity()
export class Books {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  categoryid: number;

  @IsInt()
  @ManyToOne(() => Category, (category) => category.books)
  @JoinColumn({ name: "categoryid" }) 
  category: Category

  @IsNotEmpty()
  @IsString()
  @Column()
  title: string

  @IsNotEmpty()
  @IsString()
  @Column()
  author: string

  @IsNotEmpty()
  @IsString()
  @Column()
  isbn: string

  @IsNotEmpty()
  @IsDate()
  @Column({ type: 'date' })
  publisheddate: Date

  @IsNotEmpty()
  @IsNumber()
  @Column()
  stock: number

  // @OneToMany(() => RentalBook, (rb) => rb.book)
  // rental_books: RentalBook[];
}
