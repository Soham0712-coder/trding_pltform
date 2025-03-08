const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow frontend to access API
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, ".")));

// Path to auth.json
const authFilePath = path.join(__dirname, "auth.json");

// Ensure auth.json exists
if (!fs.existsSync(authFilePath)) {
  fs.writeFileSync(authFilePath, JSON.stringify({ users: [] }, null, 2));
}

// Read auth.json
function readAuthFile() {
  try {
    const data = fs.readFileSync(authFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading auth file:", err);
    return { users: [] };
  }
}

// Write to auth.json
function writeAuthFile(data) {
  try {
    fs.writeFileSync(authFilePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing auth file:", err);
    return false;
  }
}

// Login API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const authData = readAuthFile();

  console.log("Login Attempt:", username);

  const user = authData.users.find(
    (u) => (u.username === username || u.email === username) && u.password === password
  );

  if (user) {
    console.log("Login successful for:", user.username);
    res.json({ success: true, username: user.username, email: user.email });
  } else {
    console.log("Login failed for:", username);
    res.json({ success: false, message: "Invalid username or password" });
  }
});

// Signup API
app.post("/api/signup", (req, res) => {
    console.log("Signup Request Received:", req.body);
  
    const { username, password, email, dematAccount, transPassword } = req.body;
    const authData = readAuthFile();
  
    if (!username || !password || !email || !dematAccount || !transPassword) {
      console.log("❌ Signup failed: Missing required fields");
      return res.json({ success: false, message: "All fields are required" });
    }
  
    const existingUser = authData.users.find(
      (u) => u.username === username || u.email === email
    );
  
    if (existingUser) {
      console.log("❌ Signup failed: Username or email exists");
      return res.json({ success: false, message: "Username or email already exists" });
    }
  
    authData.users.push({ username, email, password, dematAccount, transPassword });
  
    if (writeAuthFile(authData)) {
      console.log("✅ User registered successfully:", username);
      res.json({ success: true, message: "User registered successfully" });
    } else {
      console.log("❌ Failed to write to file!");
      res.json({ success: false, message: "Error saving user data" });
    }
  });
  

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
