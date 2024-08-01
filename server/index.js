const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user.models");
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

try {
  mongoose.connect(process.env.MONGO_URI).then(console.log("connected to db"));
} catch (error) {
  console.log(error);
}

app.get("/", (req, res) => {
  res.send("hello world");
});
app.listen(3000, () => {
  console.log("server started at 3000");
});

app.post("/auth/register", async (req, res) => {
  try {
    const email = req.body.email;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "user already exists , please try a different email id" });
    }

    const user = await User.create({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    await user.save();
    res.json({ msg: "user added" });
    console.log(req.body);
  } catch (error) {
    console.log(error);
    res.json({ msg: "some error occured" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (user) {
      console.log(`${user.username} is found`);
      return res.json({ msg: "user found" });
    } else {
      return res.status(400).json({
        msg: "user does not exist , please sign up or use a different email id.",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ msg: "some error occured" });
  }
});
