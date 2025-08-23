import mysql from 'mysql2/promise'

export async function getConnection() {
  const connection = await mysql.createConnection({
    // local
    // host: 'localhost',
    // user: 'root',
    // password: 'Ay2DzVx8T27T',
    // database: 'mysql',

    // dev
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });
  return connection;
}