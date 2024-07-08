export default () => ({
  port: +process.env.PORT || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT || 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
});
