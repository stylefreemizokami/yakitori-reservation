import mysql from 'mysql2/promise';

export async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'Ay2DzVx8T27T',
    database: process.env.DATABASE_NAME || 'mysql',
    port: Number(process.env.DATABASE_PORT) || 3306,
    // host: 'localhost',
    // user: 'root',
    // password: 'Ay2DzVx8T27T',
    // database: 'mysql',
  });
  return connection;
}