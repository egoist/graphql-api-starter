# Database

We use [TypeORM](https://typeorm.io/) to manage database.

## Entities

[TypeORM entities](https://typeorm.io/#/entities) are populated at `src/database/*.entity.ts`.

## Creating a migration from entity changes

We use TypeORM to create migration, here we also provide a shorthand command to invoke TypeORM. 

After updating, adding or deleting an entity, run following command to generate a migration automatically:

```bash
yarn g:migration -n MigrationName
```

