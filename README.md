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
