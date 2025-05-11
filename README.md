# Nestjs Sequelize Implementation Example

![Nest](assets/logo.png)

## Description

A Rest API project developed with [NestJS](https://github.com/nestjs/nest) with CRUD functionality for User and Post models, JWT authentication and permissions, and integration of unit and e2e tests with Jest and Supertest.

### Technologies

-   [Sequelize](https://sequelize.org) (ORM)
-   [PostgreSQL](https://www.postgresql.org/)
-   [JWT](https://jwt.io/)
-   [Jest](https://jestjs.io/)
-   [SuperTest](https://github.com/ladjs/supertest)
-   [Swagger](https://swagger.io/)

## Prerequisites

-   [Node.js](https://nodejs.org/) (>= 22.15.0)
-   [npm](https://www.npmjs.com/) (>= 11.3.0)

## Installation Dependencies

```bash
$ npm install
```

## Environment Variables

Now we need to configure the environment variables. In the project folder, I've added a `.env.example` file as an example of the environment variables to use:

```bash
PORT=<port|number>
SECRET_JWT=<secret-key|string>

DATABASE_DIALECT=<dialect|string>
DATABASE_NAME=<database-name|string>
DATABASE_USER=<database-user|string>
DATABASE_PASSWORD=<database-password|string>
DATABASE_HOST=<host|string>
DATABASE_PORT=<port|number>
```

## Setting up the database for development and test

PostgreSQL database connection options are shown in the following table:

| Option   | Development | Test      |
| -------- | ----------- | --------- |
| Host     | localhost   | localhost |
| Port     | 5432        | 5432      |
| Username | postgres    | postgres  |
| Password | postgres    | postgres  |
| Database | nest        | nest_test |

## Running the app

With everything ready and configured, we can run the project with the following command:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

That's it! If everything went well, the project is now running locally on your computer.

## Testing

Unit tests and e2e tests were developed and implemented for each application feature. To verify the functionality of the endpoint and to ensure that there are no modifications causing errors in other functionalities of the API. To run the tests, you need to enter the following command:

```bash
# unit tests
$ npm run test

# unit tests watch
$ npm run test:watch

# e2e tests
$ npm run test:e2e

# e2e tests watch
$ npm run test:e2e:watch
```

All unit and e2e tests located within a folder called tests that is within each module will be executed, and the e2e tests are located in a folder called tests in the project root.

## Documentation Swagger

Documentation was created in Swagger to provide a better description of the different API endpoints.

- Route -> http://localhost:3000/documentation

## Docker Deploy

Docker has been configured so you don't need to have the tools installed on your system. You just need to have [Docker](https://www.docker.com) installed. To run the project in a Docker environment, run the following command:

```bash
docker compose up
```

With just this command you run the application, creating the Docker images and running the project automatically.