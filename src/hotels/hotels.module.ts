import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { RoomType } from './entities/room-type.entity';
import { Reservation } from './entities/reservation.entity';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, RoomType, Reservation])],
  controllers: [HotelsController],
  providers: [HotelsService],
  exports: [HotelsService, TypeOrmModule],
})
export class HotelsModule {}
