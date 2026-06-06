import { Account } from 'src/modules/accounts/domain/entities/account.entity';
import { CustomerChangeEmailEvent } from '../events/customer-change-email.event';
import { CustomerChangeFullNameEvent } from '../events/customer-change-fullname.event';
import { CustomerChangePasswordEvent } from '../events/customer-change-password.event';
import { CustomerRegisteredEvent } from '../events/customer-register.event';
import { Email } from '../value-objects/email.vo';
import { FullName } from '../value-objects/full-name.vo';
import { HashPassword } from '../value-objects/hash-password.vo';
import { NationalId } from '../value-objects/national-id.vo';

export class Customer {
  private _domainEvents: object[];
  private readonly _id: string | undefined;
  private _email: Email;
  private _hashPassword: HashPassword;
  private readonly _nationalId: NationalId;
  private readonly _accounts: Account[] | [];

  constructor(
    id: string | undefined,
    email: Email,
    hashPassword: HashPassword,
    nationalId: NationalId,
    public fullName: FullName,
    accounts: Account[] = [],
  ) {
    this._email = email;
    this._hashPassword = hashPassword;
    this._id = id;
    this._nationalId = nationalId;
    this._domainEvents = [];
    this._accounts = accounts;
  }

  static create(props: {
    id: string;
    email: string;
    fullName: string;
    nationalId: string;
    hashedPassword: string;
  }) {
    const customer = new Customer(
      props.id,
      Email.create(props.email),
      HashPassword.create(props.hashedPassword),
      NationalId.create(props.nationalId),
      FullName.create(props.fullName),
    );
    customer.addEvent(
      new CustomerRegisteredEvent(
        customer.id,
        customer.email.value,
        customer.fullName.value,
      ),
    );

    return customer;
  }

  get nationalId() {
    return this._nationalId;
  }

  get accountsCount() {
    return this._accounts.length;
  }

  get email() {
    return this._email;
  }

  get id() {
    return this._id as string;
  }

  get hashPassword() {
    return this._hashPassword;
  }

  get accounts() {
    return this._accounts;
  }

  private addEvent(event: object) {
    this._domainEvents.push(event);
  }

  pullEvent() {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  updateFullName(fullName: string) {
    this.fullName = FullName.create(fullName);
    this.addEvent(
      new CustomerChangeFullNameEvent(this.id, this.fullName.value),
    );
  }

  updateEmail(email: string) {
    this._email = Email.create(email);
    this.addEvent(new CustomerChangeEmailEvent(this.id, this.email.value));
  }

  updateHashPassword(password: string) {
    this._hashPassword = HashPassword.create(password);
    this.addEvent(new CustomerChangePasswordEvent(this.id));
  }
}
