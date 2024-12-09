import { Inject, Injectable } from '@nestjs/common';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(PAYMENTS_SERVICE)
    private readonly paymentsService: ClientProxy,
    private readonly reservationsRepository: ReservationsRepository,
  ) {}

  create(user: UserDto, createReservationDto: CreateReservationDto) {
    const { charge, endDate, placeId, startDate } = createReservationDto;

    return this.paymentsService.send('create_charge', charge).pipe(
      map((response) => {
        return this.reservationsRepository.create({
          endDate,
          invoiceId: response.id,
          placeId,
          startDate,
          userId: user._id,
        });
      }),
    );
  }

  findAll() {
    return this.reservationsRepository.find();
  }

  findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
