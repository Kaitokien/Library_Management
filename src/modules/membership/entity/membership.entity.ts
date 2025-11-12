import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_user: number;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  created_at: Date;
}
