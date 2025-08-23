import mysql from 'mysql2/promise'

export async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ay2DzVx8T27T',
    database: 'mysql',
  });
  return connection;
}