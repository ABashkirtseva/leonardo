## Notes

- I didn't use ENUM for type in graphql as there are known prisma/nestjs type compatability issue. If I knew it before I would use a different technology pair
- For the next step, I would improve graphql return for task, as we don't really care about scheduleId, we more care about schedule itself
- We might need to add more validation for add/update entities. For update, we should restrict what field can be updated otherwise a user can use delete/add functionality.
- I would add custom directives for UUID instead of ID validation on API level not DB and so on.


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Generate Typings

```bash
# unit tests
$ npx ts-node generate-typings
```

## Create migrations
```
$ npx prisma migrate dev --name XXX
```

