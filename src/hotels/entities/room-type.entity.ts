import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Hotel } from './hotel.entity';
import { Reservation } from './reservation.entity';

@Entity('room_types')
@Unique(['hotelId', 'pmsRoomTypeId'])
export class RoomType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  hotelId: string;

  @Column({ type: 'varchar', length: 100 })
  pmsRoomTypeId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int', default: 2 })
  capacity: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 1.0 })
  rateDifferential: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Hotel, (hotel) => hotel.roomTypes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @OneToMany(() => Reservation, (reservation) => reservation.roomType)
  reservations: Reservation[];
}

