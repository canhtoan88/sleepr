import { ConfigAuthVariables } from '@app/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentsVariablesDto extends ConfigAuthVariables {
  @IsString()
  @IsNotEmpty()
  STRIPE_SECRET_KEY: string;
}
