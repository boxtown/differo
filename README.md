# Differo

Simple community-curated content aggregation

## Requirements

- Redis
- PostgreSQL
- Node 8+
- Yarn

## Installation

Install repo and download dependencies

```
git clone https://github.com/boxtown/differo
cd differo
yarn
```

Set up environment variables

```
cp .env.example .env
```

Create the dev database to connect to

```
# Connect to your local Postgres however you wish
psql -U postgres -W
postgres=# CREATE DATABASE differo WITH OWNER postgres;
```

## Running

```
yarn start
```

## Tests

```
yarn test
```
