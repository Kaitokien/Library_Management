import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator'
import { Category } from "src/entities/category.entity";

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
}
