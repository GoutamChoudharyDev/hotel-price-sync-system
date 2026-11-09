import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { Reservation } from './entities/reservation.entity';
import { RoomType } from './entities/room-type.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,
  ) {}

  async findByDateRange(hotelId: string, from: string, to: string): Promise<Reservation[]> {
    // Pure Luxon date validation (no JS Date object)
    const fromDt = DateTime.fromISO(from);
    const toDt = DateTime.fromISO(to);

    if (!fromDt.isValid) {
      throw new BadRequestException(
        `Invalid 'from' date format: "${from}". Expected ISO YYYY-MM-DD.`,
      );
    }

    if (!toDt.isValid) {
      throw new BadRequestException(`Invalid 'to' date format: "${to}". Expected ISO YYYY-MM-DD.`);
    }

    if (fromDt > toDt) {
      throw new BadRequestException(`'from' date (${from}) cannot be after 'to' date (${to}).`);
    }

    // Query reservations whose checkIn falls within the requested [from, to] window
    return this.reservationRepository.find({
      where: {
        hotelId,
        checkIn: Between(fromDt.toISODate()!, toDt.toISODate()!),
      },
      relations: ['roomType'],
      order: { checkIn: 'ASC' },
    });
  }

  async findRoomTypesByHotelId(hotelId: string): Promise<RoomType[]> {
    return this.roomTypeRepository.find({
      where: { hotelId },
      order: { name: 'ASC' },
    });
  }

  async countRoomTypesByHotelId(hotelId: string): Promise<number> {
    return this.roomTypeRepository.count({
      where: { hotelId },
    });
  }
}
