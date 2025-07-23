const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const registerUser = async (req, res) => {
  try {
    console.log("🔵 Register route hit");
    const { username, email, password } = req.body;
    console.log("📩 Data received:", { username, email, password });
    // Check if user exists
    const existingUser = await User.findOne({ email });
    console.log("🧍 Existing user:", existingUser);
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Password hashed");

    // Create user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    console.log("✅ User saved");

    res.status(201).json({ message: "User registered successfully ✅" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Registration error: ", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
