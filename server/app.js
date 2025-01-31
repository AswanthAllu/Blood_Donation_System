const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');
const cors = require("cors");

const dbPath = path.join(__dirname, "users.db");

app.use(express.json());
app.use(cors()); // Allow requests from frontend

let db = null;

const initializeServerAndDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
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
    app.listen(5000, () => {
      console.log("Server is running on http://localhost:5000");
    });
  } catch (err) {
    console.error(err.message);
  }
};

initializeServerAndDatabase();

app.post("/signup/", async (request, response) => {
  try {
    const { name,email, password ,age,bloodGroup,mobileNumber} = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userCheckQuery = `SELECT * FROM userDetails WHERE email = ?;`;
    const user = await db.get(userCheckQuery, [email]);

    if (user === undefined) {
      const addUserQuery = `
        INSERT INTO userDetails (name, email, password,age,blood_group,mobile_number)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      const result = await db.run(addUserQuery, [name, email, hashedPassword,age, bloodGroup, mobileNumber]);


      response
        .status(200)
        .send(`created account successfully`);
    } else {
      response.status(400).send("User already exists");
    }
  } catch (error) {
    console.error(error.message);
    response.status(500).send("Internal Server Error");
  }
});


app.post('/login/', async (request, response) => {
  try {
    const { email, password } = request.body;
    const checkUserQuery = `
      SELECT * FROM userDetails WHERE email=?;
    `;
    const user = await db.get(checkUserQuery, [email]);

    if (user) {
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (isPasswordMatched) {
       
        return response.send(user.email);
      } else {
        return response.status(400).send("Invalid Password");
      }
    } else {
      return response.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
});



module.exports = app;
