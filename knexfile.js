// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/jetfuel',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
    },
  },

  test: {
    client: 'pg',
    migrations: {
      directory: './test/migrations',
    },
  },

  production: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
    },
  },
};
