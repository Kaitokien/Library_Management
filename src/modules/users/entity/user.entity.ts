import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rental } from "../../rental/entity/rental.entity";
import { Exclude } from "class-transformer";

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  EMPLOYEE = 'EMPLOYEE'
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'library_role',
    default: UserRole.USER
  })
  role: UserRole

  @OneToMany(() => Rental, (rental) => rental.user)
  rentals: Rental[]
}
