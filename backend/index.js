const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import JWT for token generation
const multer = require('multer')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',  // your database host
  user: 'Project',       // your database username
  password: 'Rakhidev11!!',       // your database password
  database: 'dbproject',  // your database name
});

// Check connection
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

app.get('/api/cars/make', (req, res) => {
  
})

// Example API: Fetch Cars from DB
app.get('/api/cars', (req, res) => {
  // SQL query to fetch all cars
  db.query('SELECT * FROM cars', (err, results) => {
    if (err) {
      console.error('Error fetching cars:', err);
      return res.status(500).json({ message: 'Error fetching cars' });
    }
    res.json(results); // Send back the results from the database
    // console.log(results)  
  });
});



app.post('/api/cars', (req, res) => {
  const {
    make,
    model,
    year,
    mileage,
    color,
    price,
    description,
    seller_id,
  } = req.body;

  // SQL query to insert the car
  const query =
    'INSERT INTO Cars (make, model, year, mileage, color, price, description, seller_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())';

  const values = [
    make,
    model,
    year,
    mileage,
    color,
    price,
    description,
    seller_id,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting car:', err);
      return res.status(500).json({ message: 'Error inserting car' });
    }
    res.status(200).json({ message: 'Car added successfully!', car_id: result.insertId });
  });
});


app.get('/api/cars/:car_id/bids', (req, res) => {
  const car_id = req.params.car_id;

  db.query(
    'SELECT b.bid_amount, b.buyer_id, b.bid_time, b.status FROM Bids b WHERE b.car_id = ? ORDER BY b.bid_time DESC',
    [car_id],
    (err, result) => {
      if (err) {
        console.error('Error fetching bids:', err);
        return res.status(500).send('Server error');
      }
      res.json(result); // Send the bids as JSON
    }
  );
});

app.get('/api/cars/seller/:seller_id', (req, res) => {
  const { seller_id } = req.params;

  const query = 'SELECT * FROM Cars WHERE seller_id = ?';
  db.query(query, [seller_id], (err, results) => {
    if (err) {
      console.error('Error fetching cars:', err);
      return res.status(500).json({ message: 'Failed to fetch cars' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No cars found for this seller' });
    }

    res.json(results);
  });
});


app.post('/api/bids', (req, res) => {
  const { buyer_id, bid_amount, car_id } = req.body;

  console.log(buyer_id)
  console.log(bid_amount)
  console.log(car_id)

  if (!buyer_id || !bid_amount || !car_id) {
    console.log("here")
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = 'INSERT INTO Bids (buyer_id, bid_amount, car_id) VALUES (?, ?, ?)';
  const arr = [buyer_id, bid_amount, car_id];

  db.query(query, arr, (err, result) => {
    console.log('Query Executed:', db.format(query, arr)); // Debug the query
    if (err) {
      console.error('Error inserting bid:', err);
      return res.status(500).json({ message: 'Error inserting bid' });
    }
    res.status(200).json({ message: 'Bid added successfully!', bid_id: result.insertId });
  });
});


app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;
  const secretKey = "admin_admin"

  // Validate input
  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Query to find user by email and role
  const query = 'SELECT * FROM Users WHERE email = ? AND role = ?';
  db.query(query, [email, role], async (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or role' });
    }

    const user = results[0];
    console.log(password)
    console.log(user.password)

    // Compare hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (user.password != password) {
      console.log("nomatch")
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      secretKey,
      { expiresIn: '1h' }
    );

    // Send response with user data and token
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        userId: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNumber: user.phone_number,
        role: user.role,
      },
    });
  });
});



//handle if admin deltes a listing
// Delete a car by car_id
app.delete('/api/cars/:id', (req, res) => {
  const carId = req.params.id; // Get car_id from URL parameters

  // SQL query to delete the car by car_id
  db.query('DELETE FROM Cars WHERE car_id = ?', [carId], (err, result) => {
    if (err) {
      console.error('Error deleting car:', err);
      return res.status(500).json({ message: 'Error deleting car' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ message: 'Car deleted successfully' });
  });
});



// Fetch a specific car by ID
app.get('/api/cars/:id', (req, res) => {
  const carId = req.params.id; // Get the car ID from the URL

  // SQL query to fetch the car with the given ID
  const query = 'SELECT * FROM Cars WHERE car_id = ?';

  db.query(query, [carId], (err, results) => {
    if (err) {
      console.error('Error fetching car by ID:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      // If no car is found, send a 404 response
      return res.status(404).json({ message: 'Car not found' });
    }

    // Send the fetched car data as a response
    res.json(results[0]);
  });
});






// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
