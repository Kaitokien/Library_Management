import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { Users } from "../../users/entity/user.entity";
import { RentalBook } from "./rental_book.entity";

export enum RentalStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
}

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: "id_user" })
  user: Users;

  @Column({
    type: 'enum',
    enum: RentalStatus,
    default: RentalStatus.PENDING
  })
  status: RentalStatus;

  @Column({ type: 'int', nullable: true })
  discount: number;

  @Column({ type: 'int', nullable: true })
  revenue: number;

  @Column({ type: 'int', nullable: true })
  penalty: number;

  @OneToMany(() => RentalBook, (rb) => rb.rental)
  rental_books: RentalBook[];
}