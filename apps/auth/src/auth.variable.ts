import { ConfigVariables } from '@app/common';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthVariables extends ConfigVariables {
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsNumber()
  JWT_EXPIRATION: number;
}
