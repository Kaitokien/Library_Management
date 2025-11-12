import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Books } from '../../books/entity/book.entity';
import { Rental } from './rental.entity';

export enum RentalBookStatus {
  PROGRESSING = 'PROGRESSING',
  BORROWED = 'BORROWED',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class RentalBook {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Books, (book) => book.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "book_id" })
  book: Books;

  @ManyToOne(() => Rental, (rental) => rental.rental_books, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "rental_id" })
  rental: Rental;

  @Column({
    type: "enum",
    enum: RentalBookStatus,
    default: RentalBookStatus.PROGRESSING,
  })
  status: RentalBookStatus;

  @Column()
  quantity: number;

  @Column()
  price_per_day: number;

  @Column({ type: 'date' })
  date_rented: Date;

  @Column({ type: 'date' })
  due_date: Date;

  @Column({ type: 'date', nullable: true })
  return_at: Date;
}
