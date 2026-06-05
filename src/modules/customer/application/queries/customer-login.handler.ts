import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomerLoginCommand } from '../commands/customer-login.command';
import { BadRequestException, Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from '../../domain/repositories/customer.repository';
import { CustomerNotFoundError } from '../../domain/errors/customer-not-found.error';
import { PASSWORD_HASHER_SERVICE } from 'src/modules/shared/services/password-hasher.service';
import { IPasswordHasher } from 'src/modules/shared/domain/ports/password-hasher.port';
import { TOKEN_SERVICE } from 'src/modules/shared/services/token.service';
import { ITokenService } from 'src/modules/shared/domain/ports/token.service.port';

@CommandHandler(CustomerLoginCommand)
export class CustomerLoginHandler implements ICommandHandler<CustomerLoginCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly repository: ICustomerRepository,
    @Inject(PASSWORD_HASHER_SERVICE)
    private readonly passwordHasherService: IPasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(cmd: CustomerLoginCommand): Promise<{ token: string }> {
    const { email, password } = cmd;
    const user = await this.repository.findByEmail(email);
    if (!user)
      throw new CustomerNotFoundError('no user with this email exists');
    const isPasswordTrue = this.passwordHasherService.compare(
      password,
      user.hashPassword.value,
    );
    if (!isPasswordTrue) throw new BadRequestException('password is not true');
    const token = this.tokenService.generate(user.id);
    return {
      token,
    };
  }
}
