import { IsNotEmpty, IsString } from "class-validator"
import { Books } from "src/entities/book.entity"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @IsNotEmpty()
  @IsString()
  @Column()
  name: string

  @IsNotEmpty()
  @IsString()
  @Column()
  description: string

  @OneToMany(() => Books, (books) => books.category)
  books: Books[]
}
