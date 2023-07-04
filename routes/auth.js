import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config.js";

const router = express.Router();
const jwtSecret =
  "asdkjq234dnwr112312mnsadkjfsdfusdufsuldeh23dnKJHahAJHQ2E1QDWDQOUYDQHW03r2ffswdef";

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, jwtSecret);
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Email or password is incorrect" });
    }

    const token = jwt.sign({ email: user.email }, jwtSecret);

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});
export default router;
