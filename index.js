import express from "express";
import mysql from "mysql2/promise";

const app = express();
const pool = mysql.createPool({
  host: "localhost",
  user: "root", // Your MySQL username
  password: "", // Your MySQL password
  database: "userProfiles", // Your database name
});

app.use(express.json());

// Handle POST request to create a new user profile
app.post("/profile", async (req, res) => {
  const { name, father, mother, age, address, phone } = req.body;
  if (!name || !father || !mother || !age || !address || !phone) {
    return res.status(400).send("Invalid input");
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO profiles (name, father_name, mother_name, age, address, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [name, father, mother, age, address, phone]
    );
    res.send({ id: result.insertId });
  } catch {
    res.status(500).send("Database error");
  }
});

// Handle GET request to fetch all user profiles
app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM profiles");
    res.send(rows);
  } catch {
    res.status(500).send("Database error");
  }
});

app.listen(8000, () => console.log("Server listening on port 8000"));
