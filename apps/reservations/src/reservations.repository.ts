import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { ReservationDocument } from './models/reservation.schema';

export class ReservationsRepository extends AbstractRepository<ReservationDocument> {
  constructor(
    @InjectModel(ReservationDocument.name)
    protected readonly reservationModel: Model<ReservationDocument>,
  ) {
    super(reservationModel);
  }
}
