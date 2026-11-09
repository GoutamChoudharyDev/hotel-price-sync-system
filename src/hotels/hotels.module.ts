import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { RoomType } from './entities/room-type.entity';
import { Reservation } from './entities/reservation.entity';
import { HotelsService } from './hotels.service';
import { ReservationsService } from './reservations.service';
import { HotelsController } from './hotels.controller';
import { HotelsResolver } from './hotels.resolver';
import { ReservationsResolver } from './reservations.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, RoomType, Reservation])],
  controllers: [HotelsController],
  providers: [HotelsService, ReservationsService, HotelsResolver, ReservationsResolver],
  exports: [HotelsService, ReservationsService, TypeOrmModule],
})
export class HotelsModule {}
