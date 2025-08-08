const pool = require("../config/db");

const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { name, phone_number, address, note, payment_type, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "products not null" });
  }

  try {
    let totalPrice = 0;
    let totalQuantity = 0;

    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const productRes = await pool.query(
          "SELECT * FROM products WHERE id = $1",
          [item.id]
        );

        if (productRes.rows.length === 0) {
          return res
            .status(400)
            .json({ message: `product not found: ID ${item.id}` });
        }

        const product = productRes.rows[0];

        const stock = parseInt(product.stock) - item.count;
        await pool.query(
          `UPDATE products SET stock=$1 WHERE id = $2 RETURNING *`,
          [stock, item.id]
        );

        const itemTotal = parseFloat(product.price) * item.count;
        totalPrice += itemTotal;
        totalQuantity += item.count;

        return {
          product_id: item.id,
          count: item.count,
        };
      })
    );
    if(totalPrice<100){
      totalPrice+=10
    }
    const orderResult = await pool.query(
      `INSERT INTO "order" (user_id, status, name, phone_number, address, note, total_quantity, total_price, payment_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        userId,
        "pending",
        name,
        phone_number,
        address,
        note,
        totalQuantity,
        totalPrice,
        payment_type,
      ]
    );

    const order = orderResult.rows[0];

    for (const item of detailedItems) {
      await pool.query(
        `INSERT INTO order_item (product_id, count, order_id)
         VALUES ($1, $2, $3) RETURNING *`,
        [item.product_id, item.count, order.id]
      );
    }
    const orderItems = await pool.query(
      `SELECT * FROM order_item WHERE order_id=$1`,
      [order.id]
    );
    const order_items = orderItems.rows;
    res.status(201).json({
      message: "Order created",
      order,
      order_items,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: err.message });
  }
};

const getOrder = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(`SELECT * FROM "order" WHERE user_id=$1`, [
      userId,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "orders not found" });
    }
    const orders = result.rows;
    res.status(201).json({
      orders,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: err.message });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM "order"`);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "orders not found" });
    }
    const orders = result.rows;
    res.status(201).json({
      message: "Order created",
      orders,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: err.message });
  }
};

const updateOrder = async (req, res) => {
  const {order_id,status} = req.body
  try {
    const result = await pool.query(
      `UPDATE "order" SET status=$1 WHERE id=$2 RETURNING *`,
      [status, order_id]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "orders not found" });
    }
    const order = result.rows[0];
    res.status(201).json({
      message: "Order updated",
      order,
    });
  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({ message: err.message });
  }
};
const deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    await pool.query(`DELETE FROM "order" WHERE id=$1`, [orderId]);
    res.status(201).json({
      message: "Order deleted",
    });
  } catch (err) {
    console.error("delete order error:", err);
    res.status(500).json({ message: err.message });
  }
};


const getOrderItems = async (req, res) => {
  const { orderId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
         order_item.id,
         order_item.count,
         products.name,
         products.price,
         products.main_image
       FROM order_item
       JOIN products ON order_item.product_id = products.id
       WHERE order_item.order_id = $1`,
      [orderId]
    );
    console.log(result.rows)
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching order items" });
  }
};

module.exports = {
  createOrder,
  getOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
  getOrderItems
};
