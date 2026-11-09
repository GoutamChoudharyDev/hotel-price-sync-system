import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { HotelStatus } from '../entities/hotel.entity';

export class CreateHotelDto {
  @ApiProperty({
    description: 'Human-readable name of the hotel property',
    example: 'Grand Palace Hotel',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Driver/PMS connector type',
    example: 'fake-pms',
    default: 'fake-pms',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  pmsType?: string = 'fake-pms';

  @ApiProperty({
    description: 'Unique property ID inside the external PMS system',
    example: 'HOTEL-101',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  pmsHotelId: string;

  @ApiPropertyOptional({
    description: 'Operational status of the hotel',
    enum: HotelStatus,
    default: HotelStatus.LIVE,
  })
  @IsEnum(HotelStatus)
  @IsOptional()
  status?: HotelStatus = HotelStatus.LIVE;

  @ApiPropertyOptional({
    description: 'Minimum allowed room price (floor guardrail)',
    example: 60.0,
    default: 50.0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  floorPrice?: number = 50.0;

  @ApiPropertyOptional({
    description: 'Maximum allowed room price (ceiling guardrail)',
    example: 600.0,
    default: 500.0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  ceilingPrice?: number = 500.0;
}

