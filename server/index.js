const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user.models");

dotenv.config();
try {
  mongoose.connect(process.env.MONGO_URI).then(console.log("connected to db"));
} catch (error) {
  console.log(error);
}
const app = express();
app.use(express.json());
app.use(cors());
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
