const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const fileUpload = require("express-fileupload");
const app = express();
const initTables = require("./config/initDB.js");

initTables();
app.use(cors());

app.use(express.json());
app.use(fileUpload());

app.use("/files", express.static(path.join(__dirname, "files")));

// Routes
const authRoutes = require("./routes/authRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");

require("./cron");

app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/user", userRoutes);
app.use("/", productRoutes);
app.use("/", orderRoutes);

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
