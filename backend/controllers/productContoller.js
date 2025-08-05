const path = require("path");
const fs = require("fs");
const pool = require("../config/db");

const uploadToCloudinary = require("../upload");

const addProduct = async (req, res) => {
  try {
    const { name, description, stock, price, categoryName } = req.body;
    const files = req.files;

    if (!files || !files.main_image) {
      return res.status(400).json({ message: "main_image file is required" });
    }

    const mainImageResult = await uploadToCloudinary(
      files.main_image.data,
      "products/main"
    );

    const category = await pool.query(
      `SELECT * FROM categories WHERE name = $1`,
      [categoryName]
    );

    if (category.rows.length === 0) {
      return res.status(403).json({ message: "Category not found" });
    }

    const categoryId = category.rows[0].id;

    const result = await pool.query(
      `INSERT INTO products (name, description, stock, price, category_id, main_image)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, stock, price, categoryId, mainImageResult.secure_url]
    );

    const newProduct = result.rows[0];

    if (files.gallery) {
      const gallery = Array.isArray(files.gallery)
        ? files.gallery
        : [files.gallery];

      for (const img of gallery) {
        const galleryResult = await uploadToCloudinary(
          img.data,
          "products/gallery"
        );

        await pool.query(
          `INSERT INTO images (product_id, img_path) VALUES ($1, $2)`,
          [newProduct.id, galleryResult.secure_url]
        );
      }
    }

    res.status(201).json({
      status: "success",
      product: newProduct,
      message: "Product and images added",
    });
  } catch (err) {
    console.error("Create product error:", err);
    res
      .status(500)
      .json({ message: "Error adding product", error: err.message });
  }
};

const getProducts = async (req, res) => {
  const { categoryName, name, id, limit, page } = req.query;
  let query = `SELECT
  products.*,
  ARRAY_REMOVE(ARRAY_AGG(images.img_path), NULL) AS images
  FROM
  products
  LEFT JOIN images ON products.id = images.product_id
  WHERE 1=1`;
  const values = [];
  let categoryId = 0;
  if (categoryName) {
    const category = await pool.query(
      `SELECT * FROM categories WHERE name=$1`,
      [categoryName]
    );
    if (category.rows.length === 0) {
      return res.status(403).json({ message: "Error category not found" });
    }
    categoryId = category.rows[0].id;
  }

  if (categoryId) {
    values.push(categoryId);
    query += ` AND products.category_id =$${values.length}`;
  }
  if (id) {
    values.push(id);
    query += ` AND products.id =$${values.length}`;
  }
  if (name) {
    values.push(`%${name}%`);
    query += ` AND products.name ILIKE $${values.length}`;
  }
  query += ` GROUP BY products.id`;

  const allProducts = await pool.query(query, values);
  let limitVal;
  let pageVal;
  if (limit && page) {
    limitVal = parseInt(limit);
    pageVal = parseInt(page) || 1;
    const offset = (pageVal - 1) * limitVal;

    values.push(limitVal);
    query += ` LIMIT $${values.length}`;
    values.push(offset);
    query += ` OFFSET $${values.length}`;
  }

  try {
    let totalPage = 0;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.json({ message: "products not found" });
    }
    if (allProducts.rows.length % limitVal === 0) {
      totalPage = allProducts.rows.length / limitVal;
    } else {
      totalPage = Math.floor(allProducts.rows.length / limitVal) + 1;
    }
    if (page > totalPage) {
      return res.json({ message: "page does not exist" });
    }
    res.json({
      page: pageVal,
      totalPages: totalPage,
      limit: limitVal,
      products: result.rows,
    });
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Error get products" });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, stock, price, categoryName } = req.body;
  const files = req.files;

  try {
    const productRes = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [productId]
    );
    if (productRes.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    const oldProduct = productRes.rows[0];

    const categoryRes = await pool.query(
      `SELECT * FROM categories WHERE name=$1`,
      [categoryName]
    );
    if (categoryRes.rows.length === 0) {
      return res.status(403).json({ message: "Category not found" });
    }
    const categoryId = categoryRes.rows[0].id;

    let mainImagePath = oldProduct.main_image;

    if (files && files.main_image) {
      if (oldProduct.main_image) {
        const publicId = oldProduct.main_image
          .split("/")
          .slice(-2)
          .join("/")
          .replace(/\.[^/.]+$/, "");
        await cloudinary.uploader.destroy(publicId);
      }

      const mainImageResult = await uploadToCloudinary(
        files.main_image.data,
        "products/main"
      );
      mainImagePath = mainImageResult.secure_url;
    }

    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, stock = $3, price = $4, category_id = $5, main_image = $6
       WHERE id = $7 RETURNING *`,
      [name, description, stock, price, categoryId, mainImagePath, productId]
    );

    res.json({
      status: "success",
      updatedProduct: result.rows[0],
    });
  } catch (err) {
    console.error("Update product error:", err);
    res
      .status(500)
      .json({ message: "Error updating product", error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const productRes = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );

    if (productRes.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productRes.rows[0];

    const imagePath = path.join(__dirname, "..", product.main_image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await pool.query(`DELETE FROM products WHERE id = $1`, [productId]);

    res.json({
      message: `${product.name} is deleted successfully.`,
    });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
};

module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
