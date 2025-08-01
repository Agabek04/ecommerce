const { Pool } = require("pg");
require("dotenv").config();

const dbName = process.env.DB_NAME;

const rootPool = new Pool({
  user: "user",
  host: "dpg-d26a8aidbo4c73eva16g-a",
  password: "p4mHHsu5LdR2sr7fV97duNDdgKuISJ33",
  port: 5432,
  database: "shop_l1c0",
  ssl: { rejectUnauthorized: false },
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
  user: "user",
  host: "dpg-d26a8aidbo4c73eva16g-a",
  password: "p4mHHsu5LdR2sr7fV97duNDdgKuISJ33",
  port: 5432,
  database: dbName,
  ssl: { rejectUnauthorized: false },
});

createDatabaseIfNotExists();

module.exports = pool;
