import { Field, Float, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { HotelStatus } from '../entities/hotel.entity';
import { RoomTypeModel } from './room-type.model';

registerEnumType(HotelStatus, {
  name: 'HotelStatus',
  description: 'Operational status of the hotel',
});

@ObjectType('Hotel')
export class HotelModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  pmsType: string;

  @Field()
  pmsHotelId: string;

  @Field(() => HotelStatus)
  status: HotelStatus;

  @Field(() => Float)
  floorPrice: number;

  @Field(() => Float)
  ceilingPrice: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [RoomTypeModel], { nullable: 'itemsAndList' })
  roomTypes?: RoomTypeModel[];

  @Field(() => Int, { description: 'Computed count of room types' })
  roomTypesCount: number;
}

