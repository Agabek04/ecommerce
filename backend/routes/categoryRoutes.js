const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const {createCategory,getCategories,updateCategory,deleteCategory}=require('../controllers/categoryController')

router.post("/add", authenticateToken, authorizeRoles("admin"), createCategory);
router.get("/", getCategories);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateCategory);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteCategory);

module.exports = router;