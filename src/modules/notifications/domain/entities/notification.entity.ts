import { NotificationType } from '../../shared/enums/notification-type.enum';

export class Notification {
  private readonly _id: string;
  private readonly _customerId: string;
  private readonly _message: string;
  private _isRead: boolean;
  private readonly _createdAt: Date;
  private readonly _type: NotificationType;

  private constructor(
    id: string,
    customerId: string,
    message: string,
    isRead: boolean,
    createdAt: Date,
    type: NotificationType,
  ) {
    this._id = id;
    this._customerId = customerId;
    this._message = message;
    this._isRead = isRead;
    this._createdAt = createdAt;
    this._type = type;
  }

  static create(props: {
    id: string;
    customerId: string;
    message: string;
    type: NotificationType;
  }): Notification {
    return new Notification(
      props.id,
      props.customerId,
      props.message,
      false,
      new Date(),
      props.type,
    );
  }

  static reconstitute(props: {
    id: string;
    customerId: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: Date;
  }): Notification {
    return new Notification(
      props.id,
      props.customerId,
      props.message,
      props.isRead,
      props.createdAt,
      props.type,
    );
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get message(): string {
    return this._message;
  }

  get type(): NotificationType {
    return this._type;
  }

  get isRead(): boolean {
    return this._isRead;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  markAsRead(): void {
    this._isRead = true;
  }
}
