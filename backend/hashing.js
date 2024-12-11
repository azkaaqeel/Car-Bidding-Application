const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mahnoor1234',
  database: 'dbproject',
});

// Check connection
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');

  // Query all users and hash plain-text passwords only
  db.query("SELECT user_id, password FROM Users", async (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      db.end();
      return;
    }

    for (const user of results) {
      // Skip if password is already hashed
      if (user.password.startsWith('$2b$')) {
        console.log(`Skipping user ${user.user_id} (already hashed)`);
        continue;
      }

      try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        db.query(
          "UPDATE Users SET password = ? WHERE user_id = ?",
          [hashedPassword, user.user_id],
          (updateErr) => {
            if (updateErr) {
              console.error(`Error updating password for user ${user.user_id}:`, updateErr);
            } else {
              console.log(`Password hashed for user ${user.user_id}`);
            }
          }
        );
      } catch (hashErr) {
        console.error(`Error hashing password for user ${user.user_id}:`, hashErr);
      }
    }

    console.log("Password hashing process complete.");
    db.end();
  });
});
