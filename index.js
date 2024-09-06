const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "courses_api",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
  console.log("MySQL connected...");
});

// POST API to add a new course
app.post("/add/course", (req, res) => {
  const {
    course_name,
    course_image,
    course_description,
    course_duration,
    course_trainer,
    course_price,
    course_start_date,
    course_category,
    course_status,
  } = req.body;

  // Basic validation for required fields
  if (!course_name || !course_price || !course_start_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `INSERT INTO courses (course_name, course_image, course_description, course_duration, course_trainer, course_price, course_start_date, course_category, course_status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    course_name,
    course_image,
    course_description,
    course_duration,
    course_trainer,
    course_price,
    course_start_date,
    course_category,
    course_status,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting course:", err);
      return res.status(500).json({ error: "Failed to add course" });
    }
    res.status(201).json({
      message: "Course added successfully",
      courseId: result.insertId,
    });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
