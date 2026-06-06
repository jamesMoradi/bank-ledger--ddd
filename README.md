# 🏦 BankFlow

A production-grade **Digital Banking Backend** built with **Domain-Driven Design (DDD)**, **CQRS**, and **Event-Driven Architecture** using NestJS.

> This project demonstrates how to model complex financial business rules using Entities, Value Objects, Domain Events, and Bounded Contexts — all wired together with NestJS CQRS and TypeORM.

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Bounded Contexts](#bounded-contexts)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [DDD Concepts Used](#ddd-concepts-used)
- [Domain Events](#domain-events)
- [Business Rules](#business-rules)

---

## ✨ Features

- Customer registration, authentication, and profile management
- Bank account lifecycle (open, freeze, unfreeze, close)
- Deposit, withdrawal, and transfer between accounts
- Automatic fraud detection based on transaction patterns
- Event-driven notifications on every key action
- Admin dashboard for monitoring accounts, transactions, and fraud alerts
- JWT-based authentication with role-based access control (RBAC)
- Full Swagger API documentation

---

## 🏛️ Architecture

BankFlow is built around three core architectural patterns:

### Domain-Driven Design (DDD)

Business logic lives inside the domain layer — entities protect their own invariants, Value Objects enforce data validity, and Domain Events communicate state changes between bounded contexts.

### CQRS (Command Query Responsibility Segregation)

Every write operation is a **Command** with its own handler. Every read operation is a **Query** with its own handler. They never mix.

```
HTTP Request
     │
     ▼
Controller (DTO validation)
     │
     ├── CommandBus ──► CommandHandler ──► Entities ──► Repository
     │                                         │
     │                                    Domain Events
     │                                         │
     │                              ┌──────────┴──────────┐
     │                              ▼                     ▼
     │                    FraudHandler           NotificationHandler
     │
     └── QueryBus ──► QueryHandler ──► Repository ──► ResponseDTO
```

### Event-Driven Architecture

Bounded contexts communicate exclusively through Domain Events. No module imports another module's services directly.

---

## 🧩 Bounded Contexts

| Context          | Responsibility                    | Key Entities   |
| ---------------- | --------------------------------- | -------------- |
| **Identity**     | Customer registration and profile | `Customer`     |
| **Account**      | Account lifecycle management      | `Account`      |
| **Transaction**  | All money movement                | `Transaction`  |
| **Fraud**        | Detect suspicious activity        | `FraudAlert`   |
| **Notification** | Inform customers of actions       | `Notification` |
| **Admin**        | Read-only monitoring dashboard    | —              |

### Context Map

```
Identity Context ──────────────► Account Context
                                       │
                                       ▼
                                Transaction Context
                                   │           │
                                   ▼           ▼
                           Fraud Context   Notification Context
                                   │
                                   ▼
                            Account Context (auto-freeze)
```

---

## 🛠️ Tech Stack

| Technology                                                         | Purpose             |
| ------------------------------------------------------------------ | ------------------- |
| [NestJS](https://nestjs.com/)                                      | Backend framework   |
| [TypeScript](https://www.typescriptlang.org/)                      | Language            |
| [PostgreSQL](https://www.postgresql.org/)                          | Database            |
| [TypeORM](https://typeorm.io/)                                     | ORM                 |
| [@nestjs/cqrs](https://docs.nestjs.com/recipes/cqrs)               | CQRS implementation |
| [@nestjs/event-emitter](https://docs.nestjs.com/techniques/events) | Domain event bus    |
| [@nestjs/jwt](https://docs.nestjs.com/security/authentication)     | JWT authentication  |
| [Passport](https://www.passportjs.org/)                            | Auth middleware     |
| [class-validator](https://github.com/typestack/class-validator)    | DTO validation      |
| [Swagger](https://swagger.io/)                                     | API documentation   |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js)               | Password hashing    |
| [uuid](https://github.com/uuidjs/uuid)                             | ID generation       |

---

## 📁 Project Structure

```
src/
├── common/
│   └── enums/
│       └── currency.enum.ts
│
├── modules/
│   ├── shared/
│   │   ├── domain/
│   │   │   ├── errors/
│   │   │   │   ├── domain.error.ts
│   │   │   │   ├── bad-request.error.ts
│   │   │   │   ├── not-found.error.ts
│   │   │   │   ├── conflict.error.ts
│   │   │   │   ├── unauthorized.error.ts
│   │   │   │   └── forbidden.error.ts
│   │   │   └── value-objects/
│   │   │       ├── money.vo.ts
│   │   │       └── currency.vo.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── filters/
│   │   │   └── catch-all.filter.ts
│   │   └── services/
│   │       ├── token.service.ts
│   │       └── password-hasher.service.ts
│   │
│   ├── customer/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── customer.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── email.vo.ts
│   │   │   │   ├── full-name.vo.ts
│   │   │   │   ├── national-id.vo.ts
│   │   │   │   └── hash-password.vo.ts
│   │   │   ├── events/
│   │   │   │   ├── customer-registered.event.ts
│   │   │   │   ├── customer-email-changed.event.ts
│   │   │   │   ├── customer-fullname-changed.event.ts
│   │   │   │   └── customer-password-changed.event.ts
│   │   │   ├── errors/
│   │   │   │   └── customer.errors.ts
│   │   │   └── repositories/
│   │   │       └── customer.repository.ts
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── register-customer.command.ts + handler
│   │   │   │   ├── update-email.command.ts + handler
│   │   │   │   ├── update-fullname.command.ts + handler
│   │   │   │   └── update-password.command.ts + handler
│   │   │   └── queries/
│   │   │       ├── get-customer-by-id.query.ts + handler
│   │   │       ├── get-all-customers.query.ts + handler
│   │   │       └── customer-login.query.ts + handler
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   │   ├── entities/customer.entity.ts
│   │   │   │   ├── repositories/customer.repository.impl.ts
│   │   │   │   └── mappers/customer.mapper.ts
│   │   │   └── http/
│   │   │       ├── controllers/customer.controller.ts
│   │   │       └── dtos/
│   │   └── customer.module.ts
│   │
│   ├── account/
│   │   └── ...same structure
│   │
│   ├── transaction/
│   │   └── ...same structure
│   │
│   ├── fraud/
│   │   └── ...same structure
│   │
│   ├── notification/
│   │   └── ...same structure
│   │
│   └── admin/
│       └── ...same structure
│
└── app.module.ts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/bankflow.git
cd bankflow

# Install dependencies
npm install
```

### Database Setup

```bash
# Create a PostgreSQL database
createdb bankflow
```

### Running the App

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# App
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=bankflow

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

---

## 📖 API Documentation

Once the app is running, Swagger UI is available at:

```
http://localhost:3000/api
```

### Endpoints Overview

#### Customers

| Method  | Endpoint              | Description             | Auth   |
| ------- | --------------------- | ----------------------- | ------ |
| `POST`  | `/customers/register` | Register a new customer | Public |
| `POST`  | `/customers/login`    | Login and get JWT token | Public |
| `GET`   | `/customers/:id`      | Get customer by ID      | JWT    |
| `GET`   | `/customers`          | Get all customers       | JWT    |
| `PATCH` | `/customers`          | Update profile          | JWT    |

#### Accounts

| Method  | Endpoint               | Description        | Auth  |
| ------- | ---------------------- | ------------------ | ----- |
| `POST`  | `/accounts`            | Open a new account | JWT   |
| `GET`   | `/accounts/:id`        | Get account by ID  | JWT   |
| `GET`   | `/accounts`            | Get my accounts    | JWT   |
| `PATCH` | `/accounts/:id/freeze` | Freeze account     | Admin |
| `PATCH` | `/accounts/:id/close`  | Close account      | Admin |

#### Transactions

| Method | Endpoint                 | Description               | Auth |
| ------ | ------------------------ | ------------------------- | ---- |
| `POST` | `/transactions/deposit`  | Deposit money             | JWT  |
| `POST` | `/transactions/withdraw` | Withdraw money            | JWT  |
| `POST` | `/transactions/transfer` | Transfer between accounts | JWT  |
| `GET`  | `/transactions`          | Get my transactions       | JWT  |

#### Admin

| Method | Endpoint              | Description      | Auth  |
| ------ | --------------------- | ---------------- | ----- |
| `GET`  | `/admin/accounts`     | All accounts     | Admin |
| `GET`  | `/admin/transactions` | All transactions | Admin |
| `GET`  | `/admin/fraud-alerts` | All fraud alerts | Admin |

---

## 🎯 DDD Concepts Used

### entities

The main business entities that protect their own invariants. Nothing outside can put them in an invalid state.

- `Customer` — owns email, password, fullName. Validates all changes internally.
- `Account` — owns balance, IBAN, status. Enforces frozen/closed guards before every transaction.
- `Transaction` — records every money movement immutably.
- `FraudAlert` — created automatically when rules are triggered.

### Value Objects

Immutable types defined by their value, not identity. Always valid — construction throws if input is invalid.

| Value Object   | Validates                                |
| -------------- | ---------------------------------------- |
| `Email`        | Format via `isEmail()`                   |
| `FullName`     | Min 2 chars per part                     |
| `NationalId`   | 6–20 alphanumeric                        |
| `HashPassword` | Non-empty                                |
| `IBAN`         | Format via `isIBAN()`                    |
| `Money`        | Non-negative, same-currency arithmetic   |
| `Currency`     | Must be in `Currencies` enum             |
| `Status`       | Must be valid `AccountStatus` enum value |

### Repository Pattern

Every aggregate has an interface in `domain/repositories/` and an implementation in `infrastructure/persistence/repositories/`. The domain never depends on TypeORM directly.

```typescript
// domain knows only this interface
export interface ICustomerRepository {
  save(customer: Customer): Promise<void>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findByNationalId(nationalId: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
}
```

---

## 📡 Domain Events

Events are raised by entities and published after persistence. Other contexts listen and react independently.

| Event                          | Raised By                       | Listeners                           |
| ------------------------------ | ------------------------------- | ----------------------------------- |
| `CustomerRegisteredEvent`      | `Customer.create()`             | Notification                        |
| `CustomerEmailChangedEvent`    | `Customer.updateEmail()`        | Notification                        |
| `CustomerPasswordChangedEvent` | `Customer.updateHashPassword()` | Notification                        |
| `AccountOpenedEvent`           | `Account.create()`              | Notification                        |
| `AccountFrozenEvent`           | `Account.freeze()`              | Notification                        |
| `AccountClosedEvent`           | `Account.close()`               | Notification                        |
| `MoneyDepositedEvent`          | `Account.increaseBalance()`     | Fraud, Notification                 |
| `MoneyWithdrawnEvent`          | `Account.decreaseBalance()`     | Fraud, Notification                 |
| `TransferDebitedEvent`         | `Account.decreaseBalance()`     | Fraud, Notification                 |
| `TransferCreditedEvent`        | `Account.increaseBalance()`     | Notification                        |
| `TransferFailedEvent`          | Transfer handler                | Fraud, Notification                 |
| `FraudDetectedEvent`           | Fraud handler                   | Account (auto-freeze), Notification |

---

## 📏 Business Rules

### Customer

- Email and national ID must be unique
- Password minimum 8 characters

### Account

- Maximum 3 accounts per customer
- Cannot transact on FROZEN or CLOSED accounts
- Cannot close an account with balance > 0
- Supported currencies: USD, EUR

### Transactions

- Minimum transaction amount: $1
- Maximum single withdrawal: $10,000
- Maximum daily withdrawals: $20,000
- Transfers between different currencies not supported (v1)

### Fraud Detection

Automatically freezes an account when any of these rules trigger:

- More than 5 withdrawals within 1 hour
- Single transaction greater than $8,000
- 3 consecutive failed transfers

---

## 📄 License

MIT License — feel free to use this project as a reference or starting point.

---

<p align="center">Built with ❤️ using NestJS · DDD · CQRS · TypeORM</p>
