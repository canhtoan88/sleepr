import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConfigVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  MONGODB_URI: string;
}

export class ConfigAuthVariables extends ConfigVariables {
  @IsString()
  @IsNotEmpty()
  AUTH_HOST: string;

  @IsString()
  @IsNotEmpty()
  AUTH_PORT: string;
}
