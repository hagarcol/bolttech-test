import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Car } from "./Car";

@Entity({ name: "bookings" })
export class Booking {
  @PrimaryGeneratedColumn()
  book_id!: number;

  @Column()
  user_id!: number;

  @Column()
  car_id!: number;

  @Column({ type: "date" })
  start_date!: Date;

  @Column({ type: "date" })
  end_date!: Date;

  @Column("decimal", { precision: 10, scale: 2 })
  total_price!: number;
  
  @Column("decimal", { precision: 10, scale: 2 })
  average_price!: number;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Car, (car) => car.bookings)
  @JoinColumn({ name: "car_id" })
  car!: Car;
}
