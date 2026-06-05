import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { CustomerUnAuthorizedError } from '../domain/errors/unauthorized.error';
import { TOKEN_SERVICE } from '../services/token.service';
import { ITokenService } from '../domain/ports/token.service.port';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    const payload = this.tokenService.verify(token);
    if (!payload) throw new UnauthorizedException('customer unauthorized');

    request.customerId = payload.customerId;

    return true;
  }

  private extractToken(request: Request): string {
    const headers = request['headers'];
    if (!headers || !headers.authorization)
      throw new CustomerUnAuthorizedError('customer unauthorized');
    const [bearer, token] = headers['authorization'].split(' ');
    if (
      !bearer ||
      !token ||
      !token.trim() ||
      !bearer.trim() ||
      bearer.toLowerCase() !== 'bearer'
    )
      throw new CustomerUnAuthorizedError('customer unauthorized');

    return token;
  }
}
