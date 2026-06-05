import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export const HASHER_SERVICE = Symbol('HASHER_SERVICE');

@Injectable()
export class HasherService {
  private readonly algorithm: string = 'aes-256-cbc';
  private readonly length: number = 10;
  private readonly key: Buffer;

  constructor(private readonly configService: ConfigService) {
    this.key = Buffer.from(
      this.configService.get<string>('CRYPTO_KEY') as string,
      'hex',
    );
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.length);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }
  decrypt(data: string): string {
    const [ivHex, encryptedHex] = data.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    const decrypt = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return decrypt.toString();
  }
}
