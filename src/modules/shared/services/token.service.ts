import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ITokenService, VerifyToken } from '../domain/ports/token.service.port';

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generate(customerId: string) {
    const token = this.jwtService.sign(
      { customerId },
      {
        expiresIn: '30d',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );
    return token;
  }

  verify(token: string): VerifyToken {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    }) as VerifyToken;

    return payload;
  }
}
