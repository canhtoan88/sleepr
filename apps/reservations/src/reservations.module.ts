import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_SERVICE,
  configValidation,
  DatabaseModule,
  LoggerModule,
  PAYMENTS_SERVICE,
} from '@app/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsVariablesDto } from './dto/reservations-variable.dto';
import {
  ReservationDocument,
  ReservationSchema,
} from './models/reservation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => configValidation(ReservationsVariablesDto, config),
    }),
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (
          configService: ConfigService<{
            AUTH_HOST: string;
            AUTH_PORT: number;
          }>,
        ) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_HOST', { infer: true }),
            port: configService.get<number>('AUTH_PORT', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (
          configService: ConfigService<{
            PAYMENTS_HOST: string;
            PAYMENTS_PORT: number;
          }>,
        ) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('PAYMENTS_HOST', { infer: true }),
            port: configService.get<number>('PAYMENTS_PORT', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
