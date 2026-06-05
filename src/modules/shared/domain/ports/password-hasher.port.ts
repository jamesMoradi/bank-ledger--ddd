export interface IPasswordHasher {
  encrypt(password: string): string;
  compare(password: string, hashedPassword: string): boolean;
}
