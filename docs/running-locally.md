# Running locally

## Configure `.env` file

Create a `.env` file from the default template:

```bash
cp .env.example .env
```

## Initialize a database

```sql
# Run psql
> psql -d postgres

# Create a user called "dev" (default name)
> create user dev;

# Create a database (default name)
> create database graphql_api_starter;

# Switch to the created database
> psql -d graphql_api_starter
# Create UUID extension
> create extension if not exists "uuid-ossp";
```

## Run server in dev mode

```bash
yarn dev
```

Then navigate to `http://localhost:3000/graphql`.