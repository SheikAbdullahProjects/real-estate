import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();


console.log(process.env.DB_HOST)

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  const connection = await pool.getConnection();
  console.log("Database connected successfully");
  connection.release();
})();

export default pool;
