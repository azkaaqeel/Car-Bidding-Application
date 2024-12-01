const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',  // your database host
  user: 'root',       // your database username
  password: 'mahnoor1234',       // your database password
  database: 'projectdata',  // your database name
});

// Check connection
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Example API: Fetch Cars from DB
app.get('/api/cars', (req, res) => {
  // SQL query to fetch all cars
  db.query('SELECT * FROM cars', (err, results) => {
    if (err) {
      console.error('Error fetching cars:', err);
      return res.status(500).json({ message: 'Error fetching cars' });
    }
    res.json(results); // Send back the results from the database
  });
});

// Handle login
app.post('/api/login', (req, res) => {
    const { username, password, role } = req.body;
  
    // Check if all fields are provided
    if (!username || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
  
    // SQL query to check credentials and role
    db.query(
      'SELECT * FROM users WHERE username = ? AND password = ? AND role = ?',
      [username, password, role],
      (err, results) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error logging in' });
        }
  
        if (results.length > 0) {
          // User found
          return res.json({ success: true, message: 'Login successful' });
        } else {
          // Invalid credentials or role
          return res.status(401).json({ success: false, message: 'Invalid credentials or role' });
        }
      }
    );
  });
  
// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
