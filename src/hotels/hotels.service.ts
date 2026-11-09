import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}

  async create(dto: CreateHotelDto): Promise<Hotel> {
    const hotel = this.hotelRepository.create(dto);
    return this.hotelRepository.save(hotel);
  }

  async findAll(): Promise<Hotel[]> {
    return this.hotelRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['roomTypes'],
    });
  }

  async findOne(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({
      where: { id },
      relations: ['roomTypes'],
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel with ID "${id}" was not found.`);
    }

    return hotel;
  }

  async findByPmsHotelId(pmsHotelId: string): Promise<Hotel | null> {
    return this.hotelRepository.findOne({
      where: { pmsHotelId },
      relations: ['roomTypes'],
    });
  }

  async update(id: string, dto: UpdateHotelDto): Promise<Hotel> {
    const hotel = await this.findOne(id);
    const updated = this.hotelRepository.merge(hotel, dto);
    return this.hotelRepository.save(updated);
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const hotel = await this.findOne(id);
    await this.hotelRepository.remove(hotel);
    return { deleted: true, id };
  }
}
