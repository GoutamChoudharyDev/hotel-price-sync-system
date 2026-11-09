import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('RoomType')
export class RoomTypeModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  hotelId: string;

  @Field()
  pmsRoomTypeId: string;

  @Field()
  name: string;

  @Field(() => Int)
  capacity: number;

  @Field(() => Float)
  rateDifferential: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

