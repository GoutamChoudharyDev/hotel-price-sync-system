import { Field, Float, InputType } from '@nestjs/graphql';
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

@InputType()
export class CreateHotelInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @Field({ nullable: true, defaultValue: 'fake-pms' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  pmsType?: string = 'fake-pms';

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  pmsHotelId: string;

  @Field(() => HotelStatus, { nullable: true, defaultValue: HotelStatus.LIVE })
  @IsEnum(HotelStatus)
  @IsOptional()
  status?: HotelStatus = HotelStatus.LIVE;

  @Field(() => Float, { nullable: true, defaultValue: 50.0 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  floorPrice?: number = 50.0;

  @Field(() => Float, { nullable: true, defaultValue: 500.0 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  ceilingPrice?: number = 500.0;
}

