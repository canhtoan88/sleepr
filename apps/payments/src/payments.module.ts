import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_SERVICE,
  configValidation,
  DatabaseModule,
  LoggerModule,
} from '@app/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentsVariablesDto } from './dto/payments-variable.dto';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => configValidation(PaymentsVariablesDto, config),
    }),
    LoggerModule,
    DatabaseModule,
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
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
