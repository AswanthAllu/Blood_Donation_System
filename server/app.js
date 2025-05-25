// backend/index.js
const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");
const cors = require("cors");

const dbPath = path.join(__dirname, "users.db");

app.use(cors());
app.use(express.json());

let db = null;

const initializeServerAndDatabase = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    await db.run(`
      CREATE TABLE IF NOT EXISTS userDetails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        age INTEGER,
        blood_group TEXT,
        mobile_number TEXT
      );
    `);
    app.listen(5000, () => console.log("Server is running at http://localhost:5000"));
  } catch (err) {
    console.error(err.message);
  }
};

initializeServerAndDatabase();

app.post("/signup/", async (req, res) => {
  const { name, email, password, age, bloodGroup, mobileNumber } = req.body;
  try {
    const user = await db.get(`SELECT * FROM userDetails WHERE email = ?`, [email]);
    if (user) return res.status(400).send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
      `INSERT INTO userDetails (name, email, password, age, blood_group, mobile_number) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, age, bloodGroup, mobileNumber]
    );

    res.status(200).send("Account created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});
