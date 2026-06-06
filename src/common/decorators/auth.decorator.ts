import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/shared/guards/auth.guard';

export function AuthDecorator() {
  return applyDecorators(ApiBearerAuth('jwt'), UseGuards(AuthGuard));
}
