import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { compareSync, hashSync } from 'bcryptjs';
import { UsersRepository } from './uers.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const { email, strongPassword } = createUserDto;

    await this.validateCreateUser(email);

    return this.usersRepository.create({
      email,
      password: hashSync(strongPassword, 10),
    });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });

    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  findAll() {
    return this.usersRepository.find();
  }

  getUser(_id: string) {
    return this.usersRepository.findOne({ _id });
  }

  delete(_id: string) {
    return this.usersRepository.findOneAndDelete({ _id });
  }

  private async validateCreateUser(email: string) {
    const exists = await this.usersRepository.exists({ email });

    if (exists) {
      throw new UnprocessableEntityException('User already exists');
    }
  }
}
