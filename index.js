import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/user.js";
import Place from "./models/place.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config.js";

const app = express();

app.use(cors());
app.use(express.json());
const jwtSecret =
  "asdkjq234dnwr112312mnsadkjfsdfusdufsuldeh23dnKJHahAJHQ2E1QDWDQOUYDQHW03r2ffswdef";

app.post("/register", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.post("/userinfo", async (req, res) => {
  const { token } = req.body;

  try {
    const user = jwt.verify(token, jwtSecret);

    const userEmail = user.email;
    User.findOne({ email: userEmail })
      .then((data) => {
        res.send({ status: "ok", data });
      })
      .catch((err) => {
        res.send({ status: "error", data: err });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/v2/places", async (req, res) => {
  const { place_id, fuel_price, isOpenNow, working_hours } = req.body;
  try {
    const existingPlace = await Place.findOne({ place_id });

    if (existingPlace) {
      return res
        .status(400)
        .json({ status: "error", error: "Bu joy allaqachon mavjud" });
    }

    const newPlace = Place.create({
      place_id,
      fuel_price,
      isOpenNow,
      working_hours,
    });
    res.status(201).json({ new_place: newPlace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/v2/places", async (req, res) => {
  try {
    const places = await Place.find({});
    res.json({ status: "ok", data: places });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => "Connnected to MongoDB")
  .catch((err) => console.log(err));

app.listen(5000, () => {
  console.log("Listeninig on port 5000");
});
