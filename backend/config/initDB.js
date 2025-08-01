const pool = require("./db.js");

async function initTables() {
  try {
    // USERS table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // CATEGORIES table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);

    // PRODUCTS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        stock INTEGER DEFAULT 0,
        price DECIMAL,
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        main_image TEXT NOT NULL
      );
    `);

    // images
    await pool.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        img_path TEXT NOT NULL
      );
    `);

    // Order
    await pool.query(`
  CREATE TABLE IF NOT EXISTS "order" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    name TEXT NOT NULL,
    phone_number BIGINT,
    address TEXT NOT NULL,
    note TEXT NOT NULL,
    total_quantity INTEGER,
    total_price DECIMAL,
    payment_type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

    // order item
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "order_item" (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        count INTEGER,
        order_id INTEGER REFERENCES "order"(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error("Error creating tables:", err);
  }
}

module.exports = initTables;
