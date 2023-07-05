import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/user.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import authRoutes from "./routes/auth.js";
import placesRoutes from "./routes/places.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/v2/places", placesRoutes);

const jwtSecret =
  "asdkjq234dnwr112312mnsadkjfsdfusdufsuldeh23dnKJHahAJHQ2E1QDWDQOUYDQHW03r2ffswdef";

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

mongoose
  .connect(process.env.MONGODB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.listen(5000, () => {
  console.log("Listeninig on port 5000");
});
