export type VerifyToken = { customerId: string } | null;

export interface ITokenService {
  generate(customerId: string): string;
  verify(token: string): VerifyToken;
}
