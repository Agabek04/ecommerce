const pool = require("../config/db");

const createCategory = async (req, res) => {
  const categoryName = req.body.name;
  try {
    const existingCategroy = await pool.query(
      `SELECT * FROM categories WHERE name=$1`,
      [categoryName]
    );
    if (existingCategroy.rows.length > 0) {
      return res
        .status(201)
        .json({ message: `${categoryName} is already exist in database` });
    }

    const result = await pool.query(
      `INSERT INTO categories (name)
       VALUES ($1) RETURNING *`,
      [categoryName]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ message: "error category creting" });
  }
};

const getCategories = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM categories`);
    res.status(201).json(result.rows);
  } catch (err) {
    console.error("Get jobs error:", err);
    res.status(500).json({ message: "Error get jobs" });
  }
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const categoryName = req.body.name;
  try {
    const category = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [categoryId]
    );

    if (category.rows.length === 0) {
      return res.status(403).json({ message: "Error category not found" });
    }

    const result = await pool.query(
      `UPDATE categories SET name = $1
       WHERE id = $2 RETURNING *`,
      [categoryName, categoryId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update category error:", err);
    res.status(500).json({ message: "Error in updating category" });
  }
};

const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [categoryId]
    );

    if (category.rows.length === 0) {
      return res.status(403).json({ message: "Error category not found" });
    }
    const categoryName = category.rows[0].name;
    await pool.query(`DELETE FROM categories WHERE id = $1`, [categoryId]);

    res.json({
      message: `${categoryName} is deleted from categories by admin`,
    });
  } catch (err) {
    console.error("Update category error:", err);
    res.status(500).json({ message: "Error in updating category" });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
