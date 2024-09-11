<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
  <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

---

# E-commerce Platform Documentation

## Table of Contents

1. [Description](#description)
2. [Technical Approach](#technical-approach)
    - [Ngôn ngữ](#language)
    - [Framework](#framework)
    - [Database](#database)
3. [Structure Folder and Modules](#structure-folder-and-modules)
    - [Structure Folder](#structure-folder)
    - [Modules](#modules)
4. [Commands](#commands)
    - [Deploy](#deploy)
    - [Build](#build)
    - [Test](#test)
5. [References](#references)
6. [Support](#support)
7. [Stay in touch](#stay-in-touch)
8. [License](#license)

---

## 1. Description <a name="description"></a>

This e-commerce platform is built using the NestJS framework, leveraging a modular architecture to handle various business functions like user management, product listings, and order handling. The platform is scalable, highly performant, and designed to provide a seamless experience for both administrators and end-users. The project is written in TypeScript and utilizes SQL Server as the database, with TypeORM as the Object-Relational Mapping (ORM) tool.

---

## 2. Technical Approach <a name="technical-approach"></a>

### Language <a name="language"></a>

The platform is fully developed in **TypeScript**, a superset of JavaScript that adds static typing.

### Framework <a name="framework"></a>

-   **NestJS**: Version 10 of the NestJS framework is used to structure the application and manage server-side logic. NestJS follows a modular architecture which makes it scalable and maintainable.

### Database <a name="database"></a>

-   **SQL Server** is used for database storage. All data operations, including user data, product information, and orders, are stored in SQL Server.
-   **TypeORM** is used as the ORM tool to manage interactions between the application and the SQL Server database.

---

## 3. Structure Folder and Modules <a name="structure-folder-and-modules"></a>

### Structure Folder <a name="structure-folder"></a>

The project is organized in a modular folder structure as follows:

```
📦 e-commerce-backend-nestjs
├─ .eslintrc.js
├─ .gitignore
├─ .prettierrc
├─ .vscode
│  └─ launch.json
├─ README.md
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ common
│  │  ├─ decorators
│  │  │  └─ public.decorator.ts
│  │  ├─ errors
│  │  │  ├─ auth.error.ts
│  │  │  └─ errors.ts
│  │  ├─ exception-filter
│  │  │  ├─ exceptions
│  │  │  │  ├─ auth.exception.ts
│  │  │  │  └─ fobiden.exception.ts
│  │  │  └─ filters
│  │  │     ├─ exception.filter.ts
│  │  │     └─ http-exception.filter.ts
│  │  ├─ guards
│  │  │  ├─ admin.role.guard.ts
│  │  │  ├─ manager.role.guard.ts
│  │  │  ├─ role.guard.ts
│  │  │  └─ user.role.guard.ts
│  │  ├─ interceptors
│  │  │  ├─ checkout.interceptor.ts
│  │  │  ├─ interfaces
│  │  │  │  └─ IResponse.ts
│  │  │  └─ transform.interceptor.ts
│  │  ├─ messages
│  │  │  ├─ auth.message.ts
│  │  │  └─ message.ts
│  │  ├─ middlewares
│  │  │  └─ auth.middleware.ts
│  │  └─ pipes
│  │     └─ create-employee.validator.pipe.ts
│  ├─ configs
│  │  └─ mail.config.ts
│  ├─ main.ts
│  └─ modules
│     ├─ authentication
│     │  ├─ auth-dto
│     │  │  ├─ auth.dto.ts
│     │  │  ├─ create-employee.dto.ts
│     │  │  ├─ register-customer.dto.ts
│     │  │  ├─ register.dto.ts
│     │  │  └─ token.dto.ts
│     │  ├─ auth.controller.ts
│     │  ├─ auth.module.ts
│     │  ├─ auth.service.interface.ts
│     │  └─ auth.service.ts
│     ├─ bases
│     │  ├─ base.abstract.ts
│     │  ├─ base.entity.ts
│     │  ├─ base.interface.ts
│     │  ├─ enums
│     │  │  ├─ order-status.enum.ts
│     │  │  ├─ order.enum.ts
│     │  │  └─ role.enum.ts
│     │  └─ types
│     │     ├─ payload.type.ts
│     │     └─ token.type.ts
│     ├─ databases
│     │  ├─ database.module.ts
│     │  └─ database.providers.ts
│     ├─ inventories
│     │  ├─ inventories.controller.ts
│     │  ├─ inventories.module.ts
│     │  └─ inventories.service.ts
│     ├─ orders
│     │  ├─ cart
│     │  │  ├─ cart-detail.entity.ts
│     │  │  ├─ cart-detail
│     │  │  │  ├─ cart-detail.controller.ts
│     │  │  │  ├─ cart-detail.module.ts
│     │  │  │  ├─ cart-detail.service.interface.ts
│     │  │  │  └─ cart-detail.service.ts
│     │  │  ├─ cart-dto
│     │  │  │  ├─ cart-detail.dto.ts
│     │  │  │  └─ cart.dto.ts
│     │  │  ├─ cart.controller.ts
│     │  │  ├─ cart.entity.ts
│     │  │  ├─ cart.module.ts
│     │  │  ├─ cart.service.interface.ts
│     │  │  └─ cart.service.ts
│     │  ├─ order
│     │  │  ├─ order-detail.entity.ts
│     │  │  ├─ order-detail
│     │  │  │  ├─ order-detail.controller.ts
│     │  │  │  ├─ order-detail.module.ts
│     │  │  │  ├─ order-detail.service.interface.ts
│     │  │  │  └─ order-detail.service.ts
│     │  │  ├─ order-dto
│     │  │  │  ├─ create-order.dto.ts
│     │  │  │  ├─ get-task-orders.dto.ts
│     │  │  │  ├─ order-detail.dto.ts
│     │  │  │  ├─ order-offline.dto.ts
│     │  │  │  ├─ order-online.dto.ts
│     │  │  │  └─ order.dto.ts
│     │  │  ├─ order.controller.ts
│     │  │  ├─ order.entity.ts
│     │  │  ├─ order.module.ts
│     │  │  ├─ order.service.interface.ts
│     │  │  └─ order.service.ts
│     │  ├─ payment
│     │  │  ├─ payment.controller.ts
│     │  │  ├─ payment.dto.ts
│     │  │  ├─ payment.entity.ts
│     │  │  ├─ payment.module.ts
│     │  │  ├─ payment.service.interface.ts
│     │  │  └─ payment.service.ts
│     │  ├─ shipping
│     │  │  ├─ shipping.controller.ts
│     │  │  ├─ shipping.dto.ts
│     │  │  ├─ shipping.entity.ts
│     │  │  ├─ shipping.module.ts
│     │  │  ├─ shipping.service.interface.ts
│     │  │  └─ shipping.service.ts
│     │  └─ stripe
│     │     ├─ stripe.controller.ts
│     │     ├─ stripe.module.ts
│     │     └─ stripe.service.ts
│     ├─ products
│     │  ├─ category
│     │  │  ├─ category-dto
│     │  │  │  ├─ category.dto.ts
│     │  │  │  └─ create-category.dto.ts
│     │  │  ├─ category.controller.ts
│     │  │  ├─ category.entity.ts
│     │  │  ├─ category.module.ts
│     │  │  ├─ category.service.interface.ts
│     │  │  └─ category.service.ts
│     │  ├─ discount
│     │  │  ├─ discount-dto
│     │  │  │  └─ discount.dto.ts
│     │  │  ├─ discount.controller.ts
│     │  │  ├─ discount.entity.ts
│     │  │  ├─ discount.module.ts
│     │  │  ├─ discount.service.interface.ts
│     │  │  └─ discount.service.ts
│     │  ├─ image
│     │  │  ├─ create-image.dto.ts
│     │  │  ├─ image.controller.ts
│     │  │  ├─ image.dto.ts
│     │  │  ├─ image.entity.ts
│     │  │  ├─ image.module.ts
│     │  │  ├─ image.service.interface.ts
│     │  │  └─ image.service.ts
│     │  └─ product
│     │     ├─ entities
│     │     │  └─ product.entity.ts
│     │     ├─ product-dto
│     │     │  ├─ create-product.dto.ts
│     │     │  ├─ filter-product.dto.ts
│     │     │  ├─ get-product-detail.ts
│     │     │  ├─ get-product-order.dto.ts
│     │     │  ├─ get-product.dto.ts
│     │     │  ├─ get-products-some-field.dto.ts
│     │     │  ├─ product-duplicate.dto.ts
│     │     │  ├─ product-filter.dto.ts
│     │     │  └─ product.dto.ts
│     │     ├─ product.controller.ts
│     │     ├─ product.module.ts
│     │     ├─ product.service.interface.ts
│     │     └─ product.service.ts
│     └─ users
│        ├─ account
│        │  ├─ account-dto
│        │  │  ├─ account-employee.dto.ts
│        │  │  └─ account.dto.ts
│        │  ├─ account.controller.ts
│        │  ├─ account.entity.ts
│        │  ├─ account.module.ts
│        │  ├─ account.service.interface.ts
│        │  └─ account.service.ts
│        ├─ employee
│        │  ├─ employee-dto
│        │  │  ├─ employee.dto.ts
│        │  │  └─ get-employee-list.dto.ts
│        │  ├─ employee.controller.ts
│        │  ├─ employee.entity.ts
│        │  ├─ employee.module.ts
│        │  ├─ employee.service.interface.ts
│        │  └─ employee.service.ts
│        ├─ mail.service.ts
│        ├─ position
│        │  ├─ position.controller.ts
│        │  ├─ position.dto.ts
│        │  ├─ position.entity.ts
│        │  ├─ position.module.ts
│        │  ├─ position.service.interface.ts
│        │  └─ position.service.ts
│        ├─ user
│        │  ├─ user-dto
│        │  │  ├─ create-user.dto.ts
│        │  │  ├─ get-customer-list.dto.ts
│        │  │  └─ user.dto.ts
│        │  ├─ user.controller.ts
│        │  ├─ user.entity.ts
│        │  ├─ user.module.ts
│        │  ├─ user.service.interface.ts
│        │  └─ user.service.ts
│        ├─ users.controller.spec.ts
│        ├─ users.controller.ts
│        ├─ users.module.ts
│        ├─ users.service.spec.ts
│        └─ users.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
├─ tsconfig.json
└─ yarn.lock
```

©generated by [Project Tree Generator](https://woochanleee.github.io/project-tree-generator)

### Modules <a name="modules"></a>

-   **Users Module**: Handles user registration, login, and profile management.
-   **Products Module**: Manages the listing, details, and updates for products in the e-commerce store.
-   **Orders Module**: Manages customer orders, including creation, payment processing, and order status tracking.
-   **Inventories Module**: This module is reserved for future implementation to manage product inventories.

---

## 4. Commands <a name="commands"></a>

### Deploy <a name="deploy"></a>

To deploy the application, run the following command:

```bash
npm run deploy

## Installation

bash
$ yarn install


## Running the app

bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod


## Test

bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov

```

## 5. References <a name="references"></a>

-   **NestJS**: [NestJS Documentation](https://docs.nestjs.com)
-   **Stripe**: [Stripe API Documentation](https://stripe.com/docs/api)
-   **TypeORM**: [TypeORM Documentation](https://typeorm.io/)
-   **SQL Server**: [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/sql-server/)

---

## 6. Support <a name="support"></a>

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

---

## 7. Stay in touch <a name="stay-in-touch"></a>

-   **Author**: [Kamil Myśliwiec](https://kamilmysliwiec.com)
-   **Website**: [https://nestjs.com](https://nestjs.com)
-   **Twitter**: [@nestframework](https://twitter.com/nestframework)

---

## 8. License <a name="license"></a>

Nest is [MIT licensed](https://opensource.org/licenses/MIT).
