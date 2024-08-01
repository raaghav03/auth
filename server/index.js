const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
console.log(jwtSecret);
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

try {
  mongoose.connect(process.env.MONGO_URI).then(console.log("connected to db"));
} catch (error) {
  console.log(error);
}

app.get("/", (req, res) => {
  res.send("hello world");
});

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Failed to authenticate token" });
    req.userId = decoded.id;
    next();
  });
};

app.post("/auth/register", async (req, res) => {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    const email = req.body.email;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User already exists, please try a different email ID" });
    }

    const user = await User.create({
      email: req.body.email,
      username: req.body.username,
      password: newPassword,
    });
    await user.save();
    res.json({ msg: "User added" });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Some error occurred" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      res.json({ error: "invlaid usage" });
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordValid) {
      const token = jwt.sign(
        { email: req.body.email, id: user._id },
        jwtSecret
      );
      return res.json({
        success: true,
        message: "Login successful",
        user: token,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Wrong credentials",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
});

app.get("/api/dashboard", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server started at 3000");
});
