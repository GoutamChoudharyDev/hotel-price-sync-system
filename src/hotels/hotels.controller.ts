import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Hotel } from './entities/hotel.entity';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new hotel property' })
  @ApiCreatedResponse({
    description: 'Hotel successfully registered',
    type: Hotel,
  })
  @ApiBadRequestResponse({ description: 'Invalid payload or validation failed' })
  async create(@Body() createHotelDto: CreateHotelDto): Promise<Hotel> {
    return this.hotelsService.create(createHotelDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all registered hotels' })
  @ApiOkResponse({
    description: 'Array of registered hotels',
    type: [Hotel],
  })
  async findAll(): Promise<Hotel[]> {
    return this.hotelsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific hotel by UUID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Hotel UUID' })
  @ApiOkResponse({ description: 'Hotel found', type: Hotel })
  @ApiNotFoundResponse({ description: 'Hotel with given ID does not exist' })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<Hotel> {
    return this.hotelsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing hotel property' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Hotel UUID' })
  @ApiOkResponse({ description: 'Hotel updated successfully', type: Hotel })
  @ApiNotFoundResponse({ description: 'Hotel with given ID does not exist' })
  @ApiBadRequestResponse({ description: 'Invalid payload or validation failed' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateHotelDto: UpdateHotelDto,
  ): Promise<Hotel> {
    return this.hotelsService.update(id, updateHotelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a hotel property and related sync records' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Hotel UUID' })
  @ApiOkResponse({ description: 'Hotel deleted successfully' })
  @ApiNotFoundResponse({ description: 'Hotel with given ID does not exist' })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ deleted: boolean; id: string }> {
    return this.hotelsService.remove(id);
  }
}
