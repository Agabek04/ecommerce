const { Pool } = require("pg");
require("dotenv").config();

const dbName = process.env.DB_NAME;

const rootPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: "postgres",
});

async function createDatabaseIfNotExists() {
  try {
    const res = await rootPool.query(
      `SELECT 1 FROM pg_database WHERE datname='${dbName}'`
    );
    if (res.rowCount === 0) {
      await rootPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database '${dbName}' created.`);
    } else {
      console.log(`Database '${dbName}' already exists.`);
    }
  } catch (err) {
    console.error(" Error checking/creating database:", err);
  }
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: dbName,
});

createDatabaseIfNotExists();

module.exports = pool;
