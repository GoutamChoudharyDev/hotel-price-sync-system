import { Args, ID, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { ReservationsService } from './reservations.service';
import { Hotel } from './entities/hotel.entity';
import { RoomType } from './entities/room-type.entity';
import { HotelModel } from './models/hotel.model';
import { RoomTypeModel } from './models/room-type.model';
import { CreateHotelInput } from './models/create-hotel.input';

@Resolver(() => HotelModel)
export class HotelsResolver {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly reservationsService: ReservationsService,
  ) {}

  @Query(() => [HotelModel], {
    name: 'hotels',
    description: 'Retrieve all registered hotels',
  })
  async getHotels(): Promise<Hotel[]> {
    return this.hotelsService.findAll();
  }

  @Query(() => HotelModel, {
    name: 'hotel',
    description: 'Retrieve a single hotel by UUID',
  })
  async getHotel(
    @Args('id', { type: () => ID }, new ParseUUIDPipe({ version: '4' }))
    id: string,
  ): Promise<Hotel> {
    return this.hotelsService.findOne(id);
  }

  @Mutation(() => HotelModel, {
    name: 'createHotel',
    description: 'Register a new hotel property via GraphQL',
  })
  async createHotel(@Args('input') input: CreateHotelInput): Promise<Hotel> {
    return this.hotelsService.create(input);
  }

  @ResolveField(() => [RoomTypeModel], {
    name: 'roomTypes',
    description: 'Child room types for this hotel property',
  })
  async getRoomTypes(@Parent() hotel: Hotel): Promise<RoomType[]> {
    if (hotel.roomTypes && hotel.roomTypes.length > 0) {
      return hotel.roomTypes;
    }
    return this.reservationsService.findRoomTypesByHotelId(hotel.id);
  }

  @ResolveField(() => Int, {
    name: 'roomTypesCount',
    description: 'Computed count of room types belonging to this property',
  })
  async getRoomTypesCount(@Parent() hotel: Hotel): Promise<number> {
    if (hotel.roomTypes) {
      return hotel.roomTypes.length;
    }
    return this.reservationsService.countRoomTypesByHotelId(hotel.id);
  }
}
