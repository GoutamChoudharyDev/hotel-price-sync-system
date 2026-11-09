import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { RoomType } from './room-type.entity';
import { Reservation } from './reservation.entity';

export enum HotelStatus {
  DRAFT = 'DRAFT',
  LIVE = 'LIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, default: 'fake-pms' })
  pmsType: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  pmsHotelId: string;

  @Column({
    type: 'enum',
    enum: HotelStatus,
    default: HotelStatus.LIVE,
  })
  status: HotelStatus;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 50.0 })
  floorPrice: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 500.0 })
  ceilingPrice: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => RoomType, (roomType) => roomType.hotel, { cascade: true })
  roomTypes: RoomType[];

  @OneToMany(() => Reservation, (reservation) => reservation.hotel)
  reservations: Reservation[];
}
