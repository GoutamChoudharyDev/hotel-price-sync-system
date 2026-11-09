import { Field, Float, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ReservationStatus } from '../entities/reservation.entity';
import { RoomTypeModel } from './room-type.model';

registerEnumType(ReservationStatus, {
  name: 'ReservationStatus',
  description: 'Current status of the reservation',
});

@ObjectType('Reservation')
export class ReservationModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  hotelId: string;

  @Field(() => ID, { nullable: true })
  roomTypeId: string | null;

  @Field()
  pmsReservationId: string;

  @Field()
  guestName: string;

  @Field({ description: 'Check-in date (ISO YYYY-MM-DD)' })
  checkIn: string;

  @Field({ description: 'Check-out date (ISO YYYY-MM-DD)' })
  checkOut: string;

  @Field(() => ReservationStatus)
  status: ReservationStatus;

  @Field(() => Float)
  totalAmount: number;

  @Field()
  currency: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => RoomTypeModel, { nullable: true })
  roomType?: RoomTypeModel | null;

  @Field(() => Int, { description: 'Computed duration of stay in nights (using Luxon)' })
  stayNights: number;
}

