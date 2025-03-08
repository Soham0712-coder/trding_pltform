const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.')));

// Path to auth.json
const authFilePath = path.join(__dirname, 'auth.json');

// Function to read auth.json
function readAuthFile() {
  try {
    const data = fs.readFileSync(authFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading auth file:', err);
    return { users: [] };
  }
}

// Function to write to auth.json
function writeAuthFile(data) {
  try {
    fs.writeFileSync(authFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing auth file:', err);
    return false;
  }
}

// Login API endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const authData = readAuthFile();

  // Find user by username and password
  const user = authData.users.find(u => 
    (u.username === username || u.email === username) && u.password === password
  );

  if (user) {
    // Success - return user data (excluding password)
    res.json({
      success: true,
      username: user.username,
      email: user.email
    });
  } else {
    // Failed login
    res.json({
      success: false,
      message: 'Invalid username or password'
    });
  }
});

// Signup API endpoint
app.post('/api/signup', (req, res) => {
  const { username, password, email, dematAccount, transPassword } = req.body;
  const authData = readAuthFile();

  // Check if username or email already exists
  const existingUser = authData.users.find(u => 
    u.username === username || u.email === email
  );

  if (existingUser) {
    return res.json({
      success: false,
      message: 'Username or email already exists'
    });
  }

  // Add new user
  authData.users.push({
    username,
    email,
    password,
    dematAccount,
    transPassword
  });

  // Write updated data back to auth.json
  if (writeAuthFile(authData)) {
    res.json({
      success: true,
      message: 'User registered successfully'
    });
  } else {
    res.json({
      success: false,
      message: 'Error saving user data'
    });
  }
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});