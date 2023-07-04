import express from "express";
import Place from "../models/place.js";
import "dotenv/config.js";

const router = express.Router();
router.post("/add", async (req, res) => {
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

router.get("/", async (req, res) => {
  try {
    const places = await Place.find({});
    res.json({ status: "ok", data: places });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
