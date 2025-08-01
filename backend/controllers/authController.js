const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const admin = "admin";
  try {
    const adminUsers = await pool.query("SELECT * FROM users WHERE role=$1", [
      admin,
    ]);
    if (adminUsers.rows.length > 0 && role === "admin") {
      return res.status(400).json({ message: "Admin is already exist" });
    }
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "This email is already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
      [name, email, hashedPassword, role]
    );

    const user = result.rows[0];

    res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Email or password is wrong" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Email or password is wrong " });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const { password: _, ...userInfo } = user;

    res.json({ user: userInfo, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  const email = req.params.email;
  const newPassword = req.body.password;
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(403).json({ message: "Error user not found" });
    }

    const result = await pool.query(
      `UPDATE users SET password = $1
       WHERE email = $2 RETURNING id, username, email, role`,
      [hashedPassword, email]
    );

    res.json({ message: "password is changed" });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ message: "Error in updating password" });
  }
};
const changeName = async (req, res) => {
  const userId = req.params.id;
  const newName = req.body.name;
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (user.rows.length === 0) {
      return res.status(403).json({ message: "Error user not found" });
    }

    const result = await pool.query(
      `UPDATE users SET username = $1
       WHERE id = $2 RETURNING id, username, email, role`,
      [newName, userId]
    );

    res.json({ message: "Username is changed" });
  } catch (err) {
    console.error("Update name error:", err);
    res.status(500).json({ message: "Error in updating name" });
  }
};
module.exports = { register, login, changePassword, changeName };
