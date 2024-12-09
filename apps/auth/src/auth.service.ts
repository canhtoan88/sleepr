import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersDocument } from './models/users.schema';
import { TokenPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<{ JWT_EXPIRATION: number }>,
    private readonly jwtService: JwtService,
  ) {}

  login(response: Response, user: UsersDocument) {
    const payload: TokenPayload = { sub: user._id.toHexString() };
    const token = this.jwtService.sign(payload);

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        this.configService.get<number>('JWT_EXPIRATION', { infer: true }),
    );

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }
}
