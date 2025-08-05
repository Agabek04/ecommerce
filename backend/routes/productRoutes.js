const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const {addProduct,getProducts,updateProduct,deleteProduct}=require('../controllers/productContoller')

router.post("/product/add", authenticateToken, authorizeRoles("admin"), addProduct);
router.get("/products", getProducts);
router.patch("/product/:id", authenticateToken, authorizeRoles("admin"), updateProduct);
router.delete("/product/:id", authenticateToken, authorizeRoles("admin"), deleteProduct);

module.exports = router;