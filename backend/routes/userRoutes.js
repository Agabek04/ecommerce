const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const  {changePassword , changeName}  = require("../controllers/authController");

router.put("/changepass/:id",authenticateToken, authorizeRoles('user','admin'), changePassword);
router.put("/changename/:id",authenticateToken, authorizeRoles('user'), changeName);

module.exports = router;