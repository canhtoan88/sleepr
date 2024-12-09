import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmptyObject,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { CardDto } from './card.dto';

export class CreateChargeDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;

  @IsPositive()
  amount: number;
}
