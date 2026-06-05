/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from '../domain/ports/password-hasher.port';

export const PASSWORD_HASHER_SERVICE = Symbol('PASSWORD_HASHER_SERVICE');

@Injectable()
export class PasswordHasher implements IPasswordHasher {
  compare = (password: string, hashPassword: string): boolean =>
    bcrypt.compareSync(password, hashPassword);

  encrypt = (password: string): string => bcrypt.hashSync(password, 10);
}
