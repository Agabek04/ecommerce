const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const {createOrder, getOrder, getAllOrder, updateOrder, deleteOrder, getOrderItems}=require('../controllers/orderController')

router.post("/order/add", authenticateToken, authorizeRoles("user"), createOrder);
router.get("/order",authenticateToken, authorizeRoles("user"), getOrder);
router.get("/orders",authenticateToken, authorizeRoles("admin"), getAllOrder);
router.put("/order/:id", updateOrder);
router.delete("/orders/:id",authenticateToken, authorizeRoles("admin"), deleteOrder);
router.get("/order-items/:orderId", getOrderItems);

module.exports = router;