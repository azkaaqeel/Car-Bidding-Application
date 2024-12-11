const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import JWT for token generation
const multer = require('multer')
const cron = require('node-cron');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',  // your database host
  user: 'root',       // your database username
  password: 'mahnoor1234',       // your database password
  database: 'dbproject',  // your database name
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
    category_name,  // Category name from payload
    start_time,      // Start time from payload
    end_time,        // End time from payload
    image_path,      // Image path from payload (if applicable)
  } = req.body;

  // Check if the category exists in the Categories table
  const categoryQuery = 'SELECT category_id FROM Categories WHERE category_name = ?';

  db.query(categoryQuery, [category_name], (err, results) => {
    if (err) {
      console.error('Error checking category:', err);
      return res.status(500).json({ message: 'Error checking category' });
    }

    let categoryId;

    // If category doesn't exist, insert it into the Categories table
    if (results.length === 0) {
      const insertCategoryQuery = 'INSERT INTO Categories (category_name) VALUES (?)';

      db.query(insertCategoryQuery, [category_name], (err, result) => {
        if (err) {
          console.error('Error inserting new category:', err);
          return res.status(500).json({ message: 'Error inserting new category' });
        }

        categoryId = result.insertId; // Get the new category's ID
        insertCar(categoryId);       // Insert the car after adding category
      });
    } else {
      // If category exists, use the existing category ID
      categoryId = results[0].category_id;
      insertCar(categoryId);
    }

    // Function to insert car once category is handled
    function insertCar(categoryId) {
      const query = `
        INSERT INTO Cars 
        (make, model, year, mileage, color, price, description, seller_id, category_id, start_time, end_time, image_path, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      const values = [
        make,
        model,
        year,
        mileage,
        color,
        price,
        description,
        seller_id,
        categoryId,
        start_time,
        end_time,
        image_path,
      ];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Error inserting car:', err);
          return res.status(500).json({ message: 'Error inserting car' });
        }
        res.status(200).json({ message: 'Car added successfully!', car_id: result.insertId });
      });
    }
  });
});

app.get('/api/categories', (req, res) => {
  // SQL query to fetch all categories
  db.query('SELECT * FROM Categories', (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ message: 'Error fetching categories' });
    }
    res.json(results); // Send the categories as JSON
  });
});


  app.get('/api/users/sellers', (req, res) => {
    // SQL query to fetch all categories
    db.query('SELECT * FROM Users where role="Seller"', (err, results) => {
      if (err) {
        console.error('Error fetching seller:', err);
        return res.status(500).json({ message: 'Error fetching seller' });
      }
      res.json(results); // Send the categories as JSON
    });
  });


  app.get('/api/bids', (req, res) => {
    // SQL query to fetch all categories
    db.query('SELECT * FROM Bids ', (err, results) => {
      if (err) {
        console.error('Error fetching seller:', err);
        return res.status(500).json({ message: 'Error fetching seller' });
      }
      res.json(results); // Send the categories as JSON
    });
  });



  app.get('/api/users/buyer', (req, res) => {
    // SQL query to fetch all categories
    db.query('SELECT * FROM Users where role="Buyer"', (err, results) => {
      if (err) {
        console.error('Error fetching buyers:', err);
        return res.status(500).json({ message: 'Error fetching buyers' });
      }
      res.json(results); // Send the categories as JSON
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

app.post('/api/bids', async (req, res) => {
  const { buyer_id, bid_amount, car_id } = req.body;

  if (!buyer_id || !bid_amount || !car_id) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
      // Fetch the maximum bid for the car by the same buyer
      const maxBidQuery = `
          SELECT MAX(bid_amount) AS max_bid
          FROM Bids
          WHERE buyer_id = ? AND car_id = ?
      `;
      const [maxBidResult] = await db.promise().query(maxBidQuery, [buyer_id, car_id]);

      const maxBid = maxBidResult[0]?.max_bid || 0; // Default to 0 if no previous bids

      console.log(`Current max bid by buyer (${buyer_id}) for car (${car_id}): ${maxBid}`);
      console.log(`New bid attempt: ${bid_amount}`);

      // Ensure the new bid is greater than the maximum bid
      if (parseFloat(bid_amount) <= parseFloat(maxBid)) {
          return res.status(400).json({
              message: `Your new bid must be greater than your previous maximum bid of ${maxBid}.`,
          });
      }

      // Insert the new bid into the Bids table
      const newBidQuery = `
          INSERT INTO Bids (buyer_id, bid_amount, car_id, status)
          VALUES (?, ?, ?, 'active')
      `;
      await db.promise().query(newBidQuery, [buyer_id, bid_amount, car_id]);

      // Triggers handle updating the Cars table and sending notifications

      res.status(201).json({ message: 'Bid placed successfully!' });
  } catch (error) {
      console.error('Error placing bid:', error);
      res.status(500).json({ message: 'Error placing bid.' });
  }
});

// Fetch bid history with buyer names
app.get('/api/cars/:car_id/bids', async (req, res) => {
  const { car_id } = req.params;

  try {
      const query = `
          SELECT b.bid_id, b.bid_amount, b.status, u.first_name AS buyer_name
          FROM Bids b
          LEFT JOIN Users u ON b.buyer_id = u.user_id
          WHERE b.car_id = ?
          ORDER BY b.bid_amount DESC
      `;
      const [bids] = await db.promise().query(query, [car_id]);
      res.status(200).json(bids);
  } catch (error) {
      console.error('Error fetching bids:', error);
      res.status(500).json({ message: 'Error fetching bids.' });
  }
});

app.get('/api/cars/make', (req, res) => {
  console.log("Route hit");
  const query = 'SELECT DISTINCT make FROM Cars';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching car makes:', err);
      return res.status(500).json({ message: 'Error fetching car makes' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No car makes found' });
    }

    res.json(results);
  });
});



app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body;
  const secretKey = "admin_admin";

  // Validate input
  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Query to find user by email and role
    const query = "SELECT * FROM Users WHERE email = ? AND role = ?";
    db.query(query, [email, role], async (err, results) => {
      if (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ success: false, message: "Invalid email or role" });
      }

      const user = results[0];
      console.log("Login Attempt:", { email, enteredPassword: password, storedPassword: user.password });

      // Check if the stored password is hashed
      if (!user.password.startsWith('$2b$')) {
        console.error("Stored password is not hashed. Fix database!");
        return res.status(500).json({ success: false, message: "Password is not stored securely." });
      }

      // Compare the hashed password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        console.log("Password mismatch");
        return res.status(401).json({ success: false, message: "Invalid password" });
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user.user_id, role: user.role },
        secretKey,
        { expiresIn: "1h" }
      );

      // Send response with user data and token
      res.json({
        success: true,
        message: "Login successful",
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
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
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

// Route to add a car to the wishlist
// Route to add a car to the wishlist
app.post('/api/wishlist', (req, res) => {
  const { buyer_id, car_id } = req.body;

  // Check if buyer_id and car_id are provided
  if (!buyer_id || !car_id) {
    return res.status(400).json({ message: 'buyer_id and car_id are required' });
  }

  // Check if the car is already in the wishlist
  const checkQuery = 'SELECT * FROM Wishlist WHERE buyer_id = ? AND car_id = ?';
  db.query(checkQuery, [buyer_id, car_id], (err, results) => {
    if (err) {
      console.error('Error checking wishlist:', err);
      return res.status(500).json({ message: 'Error checking wishlist' });
    }

    if (results.length > 0) {
      // If the car is already in the wishlist
      return res.status(400).json({ message: 'Car is already in the wishlist' });
    }

    // Insert the car into the wishlist table
    const insertQuery = 'INSERT INTO Wishlist (buyer_id, car_id) VALUES (?, ?)';
    db.query(insertQuery, [buyer_id, car_id], (insertErr, result) => {
      if (insertErr) {
        console.error('Error adding car to wishlist:', insertErr);
        return res.status(500).json({ message: 'Error adding car to wishlist' });
      }
      res.status(200).json({ message: 'Car added to wishlist successfully!', wishlist_id: result.insertId });
    });
  });
});


// Route to get a user's wishlist
app.get('/api/wishlist/:buyer_id', (req, res) => {
  const buyer_id = req.params.buyer_id;

  // SQL query to get all cars in the user's wishlist
  const query = 'SELECT c.* FROM Cars c JOIN Wishlist w ON c.car_id = w.car_id WHERE w.buyer_id = ?';
  db.query(query, [buyer_id], (err, results) => {
    if (err) {
      console.error('Error fetching wishlist:', err);
      return res.status(500).json({ message: 'Error fetching wishlist' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No cars found in wishlist for this user' });
    }

    res.json(results); // Send the list of cars in the wishlist
  });
});

// Route to delete a car from the wishlist
app.delete('/api/wishlist/:buyer_id/:car_id', (req, res) => {
  const { buyer_id, car_id } = req.params;

  // SQL query to delete a car from the wishlist
  const query = 'DELETE FROM Wishlist WHERE buyer_id = ? AND car_id = ?';
  db.query(query, [buyer_id, car_id], (err, result) => {
    if (err) {
      console.error('Error removing car from wishlist:', err);
      return res.status(500).json({ message: 'Error removing car from wishlist' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No such car in wishlist to delete' });
    }

    res.json({ message: 'Car removed from wishlist successfully' });
  });
});


//Messages

app.post('/api/messages', (req, res) => {
  const { user_id, seller_id, car_id, message } = req.body;

  // Validate the request body
  if (!user_id || !seller_id || !car_id || !message) {
    return res.status(400).json({ message: 'user_id, seller_id, car_id, and message are required' });
  }

  // Define the query to insert the message
  const query = `
    INSERT INTO Messages (sender_id, receiver_id, car_id, content)
    VALUES (?, ?, ?, ?)
  `;
  const values = [user_id, seller_id, car_id, message];

  // Execute the query
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error creating message:', err);
      return res.status(500).json({ message: 'Error creating message' });
    }
    res.status(201).json({ message: 'Message sent successfully!', message_id: result.insertId });
  });
});

app.get('/api/inbox/:user_id', (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT 
      m1.message_id,
      m1.sender_id,
      m1.receiver_id,
      m1.car_id,
      m1.content,
      m1.sent_at,
      m1.status,
      u1.first_name AS sender_first_name,
      u1.last_name AS sender_last_name,
      u2.first_name AS receiver_first_name,
      u2.last_name AS receiver_last_name
    FROM Messages m1
    LEFT JOIN Users u1 ON m1.sender_id = u1.user_id
    LEFT JOIN Users u2 ON m1.receiver_id = u2.user_id
    WHERE m1.message_id IN (
      SELECT MAX(message_id)
      FROM Messages
      WHERE sender_id = ? OR receiver_id = ?
      GROUP BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)
    )
    ORDER BY m1.sent_at DESC;
  `;

  db.query(query, [user_id, user_id], (err, results) => {
    if (err) {
      console.error('Error fetching inbox:', err);
      return res.status(500).json({ message: 'Error fetching inbox' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No messages found in inbox' });
    }

    res.json(results);
  });
});

app.get('/api/chats/:user_id', (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT 
      m1.car_id, 
      CASE 
        WHEN m1.sender_id = ? THEN m1.receiver_id
        ELSE m1.sender_id
      END AS seller_id,
      u.first_name AS seller_first_name,
      u.last_name AS seller_last_name,
      c.model AS car_model
    FROM Messages m1
    LEFT JOIN Users u ON u.user_id = (
      CASE 
        WHEN m1.sender_id = ? THEN m1.receiver_id
        ELSE m1.sender_id
      END
    )
    LEFT JOIN Cars c ON c.car_id = m1.car_id
    WHERE (m1.sender_id = ? OR m1.receiver_id = ?)
      AND (
        CASE 
          WHEN m1.sender_id = ? THEN m1.receiver_id
          ELSE m1.sender_id
        END
      ) != ?
    GROUP BY 
      m1.car_id, 
      CASE 
        WHEN m1.sender_id = ? THEN m1.receiver_id
        ELSE m1.sender_id
      END, 
      u.first_name, u.last_name, c.model;
  `;

  db.query(
    query,
    [user_id, user_id, user_id, user_id, user_id, user_id, user_id],
    (err, results) => {
      if (err) {
        console.error('Error fetching chats:', err);
        return res.status(500).json({ message: 'Error fetching chats' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No chats found' });
      }

      res.json(results);
    }
  );
});

// Route to fetch messages between two users
app.get('/api/messages/:user1_id/:user2_id/:car_id', (req, res) => {
  const { user1_id, user2_id, car_id } = req.params;

  const query = `
    SELECT 
      m.message_id,
      m.sender_id,
      m.receiver_id,
      m.car_id,
      m.content,
      m.sent_at,
      m.status,
      u1.first_name AS sender_first_name,
      u1.last_name AS sender_last_name,
      u2.first_name AS receiver_first_name,
      u2.last_name AS receiver_last_name
    FROM Messages m
    LEFT JOIN Users u1 ON m.sender_id = u1.user_id
    LEFT JOIN Users u2 ON m.receiver_id = u2.user_id
    WHERE 
      (m.sender_id = ? AND m.receiver_id = ? AND m.car_id = ?) 
      OR 
      (m.sender_id = ? AND m.receiver_id = ? AND m.car_id = ?)
    ORDER BY m.sent_at ASC;
  `;

  db.query(query, [user1_id, user2_id, car_id, user2_id, user1_id, car_id], (err, results) => {
    if (err) {
      console.error('Error fetching conversation:', err);
      return res.status(500).json({ message: 'Error fetching conversation' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No messages found' });
    }

    res.json(results);  // Send the fetched messages as a response
  });
});


//signup

app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, role } = req.body;

  // Check if all fields are present
  if (!firstName || !lastName || !email || !password || !phoneNumber || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const query = `
      INSERT INTO Users (first_name, last_name, email, password, phone_number, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [firstName, lastName, email, hashedPassword, phoneNumber, role];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ message: "Error creating account" });
      }
      res.status(201).json({ message: "Account created successfully", userId: result.insertId });
    });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/bids/:userId/cars', (req, res) => {
  const { userId } = req.params;

  const query = `
      SELECT DISTINCT Cars.car_id, Cars.make, Cars.model, Cars.year, Cars.mileage, 
      Cars.price, Cars.status, Cars.image_path 
      FROM Bids
      INNER JOIN Cars ON Bids.car_id = Cars.car_id
      WHERE Bids.buyer_id = ?`;

  db.query(query, [userId], (err, results) => {
      if (err) {
          console.error('Error fetching cars with bids:', err);
          return res.status(500).json({ message: 'Error fetching cars with bids' });
      }

      res.json(results);
  });
});
// Close auction for a car
app.put('/api/cars/:car_id/close', (req, res) => {
  const { car_id } = req.params;

  // Get the highest bid for the car
  const getHighestBidQuery = `
      SELECT Bids.bid_id, Bids.buyer_id, Bids.bid_amount, Users.first_name AS buyer_name, Users.email
      FROM Bids
      INNER JOIN Users ON Bids.buyer_id = Users.user_id
      WHERE Bids.car_id = ?
      ORDER BY Bids.bid_amount DESC
      LIMIT 1
  `;

  db.query(getHighestBidQuery, [car_id], (err, highestBidResults) => {
      if (err) {
          console.error('Error fetching highest bid:', err);
          return res.status(500).json({ message: 'Error fetching highest bid' });
      }

      if (highestBidResults.length === 0) {
          // No bids found for the car
          const updateCarQuery = `UPDATE Cars SET status = 'closed' WHERE car_id = ?`;
          db.query(updateCarQuery, [car_id], (err) => {
              if (err) {
                  console.error('Error updating car status:', err);
                  return res.status(500).json({ message: 'Error closing auction with no bids' });
              }
              return res.status(200).json({ message: 'Auction closed with no bids' });
          });
          return;
      }

      const winningBid = highestBidResults[0];

      // Update the car status to 'closed' and store the highest bid details
      const updateCarQuery = `
          UPDATE Cars 
          SET status = 'closed', highest_bid = ?, seller_id_of_highest_bid = ?
          WHERE car_id = ?
      `;

      db.query(updateCarQuery, [winningBid.bid_amount, winningBid.buyer_id, car_id], (err) => {
          if (err) {
              console.error('Error updating car status:', err);
              return res.status(500).json({ message: 'Error updating car status' });
          }

          // Notify the winner
          const notifyWinnerQuery = `
              INSERT INTO Notifications (user_id, car_id, message)
              VALUES (?, ?, ?)
          `;

          const notificationMessage = `Congratulations, ${winningBid.buyer_name}! You have won the auction for the car with ID ${car_id}.`;
          db.query(notifyWinnerQuery, [winningBid.buyer_id, car_id, notificationMessage], (err) => {
              if (err) {
                  console.error('Error notifying winner:', err);
                  return res.status(500).json({ message: 'Error notifying winner' });
              }

              // Mark other bids as 'lost'
              const markLostBidsQuery = `
                  UPDATE Bids SET status = 'lost'
                  WHERE car_id = ? AND buyer_id != ?
              `;

              db.query(markLostBidsQuery, [car_id, winningBid.buyer_id], (err) => {
                  if (err) {
                      console.error('Error marking bids as lost:', err);
                      return res.status(500).json({ message: 'Error marking other bids as lost' });
                  }

                  res.status(200).json({ 
                      message: 'Auction closed successfully', 
                      winning_bid: winningBid 
                  });
              });
          });
      });
  });
});

//notifications

// Fetch notifications for a user
app.get('/api/notifications/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
      SELECT notification_id, car_id, message, created_at, status
      FROM Notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
      if (err) {
          console.error('Error fetching notifications:', err);
          return res.status(500).json({ message: 'Error fetching notifications' });
      }

      res.json(results);
  });
});

// Mark a notification as read
app.put('/api/notifications/:notificationId/read', (req, res) => {
  const { notificationId } = req.params;

  const query = `UPDATE Notifications SET status = 'read' WHERE notification_id = ?`;

  db.query(query, [notificationId], (err, result) => {
      if (err) {
          console.error('Error marking notification as read:', err);
          return res.status(500).json({ message: 'Error marking notification as read' });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Notification not found' });
      }

      res.json({ message: 'Notification marked as read' });
  });
});



// DELETE API for deleting cars
app.delete('/api/cars/:carId', (req, res) => {
  const carId = req.params.carId;

  // SQL query to delete car by ID
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

// DELETE API for deleting sellers
app.delete('/api/users/sellers/:sellerId', (req, res) => {
  const sellerId = req.params.sellerId;

  // SQL query to delete seller by ID
  db.query('DELETE FROM Users WHERE user_id = ? AND role = "Seller"', [sellerId], (err, result) => {
    if (err) {
      console.error('Error deleting seller:', err);
      return res.status(500).json({ message: 'Error deleting seller' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json({ message: 'Seller deleted successfully' });
  });
});

// DELETE API for deleting buyers
app.delete('/api/users/buyer/:buyerId', (req, res) => {
  const buyerId = req.params.buyerId;

  // SQL query to delete buyer by ID
  db.query('DELETE FROM Users WHERE user_id = ? AND role = "Buyer"', [buyerId], (err, result) => {
    if (err) {
      console.error('Error deleting buyer:', err);
      return res.status(500).json({ message: 'Error deleting buyer' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    res.json({ message: 'Buyer deleted successfully' });
  });
});

// DELETE API for deleting bids
app.delete('/api/bids/:bidId', (req, res) => {
  const bidId = req.params.bidId;

  // SQL query to delete bid by ID
  db.query('DELETE FROM Bids WHERE bid_id = ?', [bidId], (err, result) => {
    if (err) {
      console.error('Error deleting bid:', err);
      return res.status(500).json({ message: 'Error deleting bid' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    res.json({ message: 'Bid deleted successfully' });
  });
});

// DELETE API for deleting categories
app.delete('/api/categories/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;

  // SQL query to delete category by ID
  db.query('DELETE FROM Categories WHERE category_id = ?', [categoryId], (err, result) => {
    if (err) {
      console.error('Error deleting category:', err);
      return res.status(500).json({ message: 'Error deleting category' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  });
});

// Fetch categories for the admin dashboard
app.get('/api/categories', (req, res) => {
  // SQL query to fetch all categories
  db.query('SELECT * FROM Categories', (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ message: 'Error fetching categories' });
    }
    res.json(results); // Send the categories as JSON
  });
});

cron.schedule('* * * * *', async () => {
  console.log('Running cron job to close expired auctions and update bid statuses...');
  
  const query = `SELECT car_id FROM Cars WHERE status = 'active' AND end_time < NOW()`;

  db.query(query, async (err, results) => {
      if (err) {
          console.error('Error fetching expired auctions:', err);
          return;
      }

      if (results.length === 0) {
          console.log('No expired auctions to process.');
          return;
      }

      for (const car of results) {
          try {
              // Close auction for the car
              const response = await axios.put(`http://localhost:5000/api/cars/${car.car_id}/close`);
              console.log(`Auction closed for car ID ${car.car_id}:`, response.data);

              // Update bid status to 'won' and 'lost'
              const bidQuery = `SELECT * FROM Bids WHERE car_id = ? ORDER BY bid_amount DESC`;
              db.query(bidQuery, [car.car_id], (err, bids) => {
                  if (err) {
                      console.error('Error fetching bids:', err);
                      return;
                  }

                  if (bids.length === 0) {
                      console.log(`No bids found for car ID ${car.car_id}`);
                      return;
                  }

                  // Update the bid statuses
                  const winningBid = bids[0]; // Highest bid
                  const winningBidQuery = `UPDATE Bids SET status = 'won' WHERE bid_id = ?`;
                  db.query(winningBidQuery, [winningBid.bid_id], (err) => {
                      if (err) {
                          console.error('Error updating winning bid:', err);
                      } else {
                          console.log(`Bid ID ${winningBid.bid_id} marked as 'won'`);
                      }
                  });

                  // Update other bids to 'lost'
                  for (const bid of bids.slice(1)) {
                      const lostBidQuery = `UPDATE Bids SET status = 'lost' WHERE bid_id = ?`;
                      db.query(lostBidQuery, [bid.bid_id], (err) => {
                          if (err) {
                              console.error('Error updating lost bid:', err);
                          } else {
                              console.log(`Bid ID ${bid.bid_id} marked as 'lost'`);
                          }
                      });
                  }

                  // Send notification to seller
                  const sellerQuery = `SELECT seller_id FROM Cars WHERE car_id = ?`;
                  db.query(sellerQuery, [car.car_id], async (err, sellerResults) => {
                      if (err || sellerResults.length === 0) {
                          console.error('Error fetching seller:', err);
                          return;
                      }
                      
                      const sellerId = sellerResults[0].seller_id;
                      const sellerNotification = await axios.post('http://localhost:5000/api/notify', {
                          user_id: sellerId,
                          message: `Your auction for car ID ${car.car_id} has closed. Winning bid: ${winningBid.bid_amount}.`
                      });
                      console.log(`Notification sent to seller ID ${sellerId}:`, sellerNotification.data);
                  });

                  // Send notification to winning buyer
                  const buyerQuery = `SELECT buyer_id FROM Bids WHERE bid_id = ?`;
                  db.query(buyerQuery, [winningBid.bid_id], async (err, buyerResults) => {
                      if (err || buyerResults.length === 0) {
                          console.error('Error fetching buyer:', err);
                          return;
                      }
                      
                      const buyerId = buyerResults[0].buyer_id;
                      const buyerNotification = await axios.post('http://localhost:5000/api/notify', {
                          user_id: buyerId,
                          message: `Congratulations! You won the auction for car ID ${car.car_id} with a bid of ${winningBid.bid_amount}.`
                      });
                      console.log(`Notification sent to buyer ID ${buyerId}:`, buyerNotification.data);
                  });
              });
          } catch (error) {
              console.error(`Error processing auction for car ID ${car.car_id}:`, error.response?.data || error.message);
          }
      }
  });
});






// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
