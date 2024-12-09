import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(
    ConfigService<{ PORT: number; AUTH_PORT: number }, true>,
  );

  // Start app as microservice with TCP transport (also: Redis, MQTT, RabbitMQ, Kafka, ...)
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('AUTH_PORT', { infer: true }),
    },
  });

  app.use(cookieParser());
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.startAllMicroservices();

  const port = configService.get('PORT', { infer: true });
  await app.listen(port, () => {
    console.info(`Auth service listening on port ${port}`);
  });
}
bootstrap();
