import { AbstractRepository } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersDocument } from '../models/users.schema';

export class UsersRepository extends AbstractRepository<UsersDocument> {
  constructor(
    @InjectModel(UsersDocument.name)
    protected readonly userModel: Model<UsersDocument>,
  ) {
    super(userModel);
  }
}
