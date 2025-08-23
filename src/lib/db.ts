import mysql from 'mysql2/promise'

export async function getConnection() {
  const connection = await mysql.createConnection({
    // local
    // host: 'localhost',
    // user: 'root',
    // password: 'Ay2DzVx8T27T',
    // database: 'mysql',
    
    // dev
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
  return connection;
}