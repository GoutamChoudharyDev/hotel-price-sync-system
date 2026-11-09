import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Hotel } from './hotel.entity';
import { RoomType } from './room-type.entity';

export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
}

@Entity('reservations')
@Unique(['hotelId', 'pmsReservationId'])
@Index(['hotelId', 'checkIn', 'checkOut'])
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  hotelId: string;

  @Column({ type: 'uuid', nullable: true })
  roomTypeId: string | null;

  @Column({ type: 'varchar', length: 100 })
  pmsReservationId: string;

  @Column({ type: 'varchar', length: 255 })
  guestName: string;

  @Column({ type: 'date' })
  checkIn: string; // ISO format: 'YYYY-MM-DD' (logic handled via Luxon)

  @Column({ type: 'date' })
  checkOut: string; // ISO format: 'YYYY-MM-DD' (logic handled via Luxon)

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.CONFIRMED,
  })
  status: ReservationStatus;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Hotel, (hotel) => hotel.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @ManyToOne(() => RoomType, (roomType) => roomType.reservations, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'roomTypeId' })
  roomType: RoomType | null;
}
