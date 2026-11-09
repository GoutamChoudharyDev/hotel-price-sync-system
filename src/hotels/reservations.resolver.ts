import { Args, ID, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { DateTime } from 'luxon';
import { ReservationsService } from './reservations.service';
import { Reservation } from './entities/reservation.entity';
import { ReservationModel } from './models/reservation.model';

@Resolver(() => ReservationModel)
export class ReservationsResolver {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Query(() => [ReservationModel], {
    name: 'reservations',
    description: 'Retrieve hotel reservations within a specified check-in date window',
  })
  async getReservations(
    @Args('hotelId', { type: () => ID }, new ParseUUIDPipe({ version: '4' }))
    hotelId: string,
    @Args('from', { description: 'Start date in ISO format (YYYY-MM-DD)' })
    from: string,
    @Args('to', { description: 'End date in ISO format (YYYY-MM-DD)' })
    to: string,
  ): Promise<Reservation[]> {
    return this.reservationsService.findByDateRange(hotelId, from, to);
  }

  @ResolveField(() => Int, {
    name: 'stayNights',
    description: 'Computed duration of stay in nights calculated via Luxon',
  })
  getStayNights(@Parent() reservation: Reservation): number {
    // Pure Luxon date calculation
    const checkIn = DateTime.fromISO(reservation.checkIn);
    const checkOut = DateTime.fromISO(reservation.checkOut);

    if (!checkIn.isValid || !checkOut.isValid) {
      return 1;
    }

    const diff = checkOut.diff(checkIn, 'days').days;
    return Math.max(1, Math.round(diff));
  }
}

