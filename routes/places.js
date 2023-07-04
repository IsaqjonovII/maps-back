import express from "express";
import Place from "../models/place.js";
import "dotenv/config.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const { place: { place_id, isOpenNow, name, working_hours }, fuel: {
    fuel_types
  }, discount  } = req.body;
  try {
    const existingPlace = await Place.findOne({ place_id });

    if (existingPlace) {
      return res
        .status(400)
        .json({ status: "error", error: "Bu joy allaqachon mavjud" });
    }

    const newPlace = await Place.create({
      place: {
        place_id,
        isOpenNow,
        name,
        working_hours
      },
      fuel: {
        fuel_types
      },
      discount
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

router.put("/edit/:id", async (req, res) => {
  const { place: { place_id, isOpenNow, name, working_hours }, fuel: {
    fuel_types
  }, discount } = req.body;

  try {
    const existingPlace = await Place.findById(place_id);

    if (!existingPlace) {
      return res
        .status(404)
        .json({ status: "error", error: "Place not found" });
    }

    existingPlace.place.place_id = place_id;
    existingPlace.fuel.fuel_types = fuel_types;
    existingPlace.place.isOpenNow = isOpenNow;
    existingPlace.place.working_hours = working_hours;
    existingPlace.discount = discount

    const updatedPlace = await existingPlace.save();

    res.json({ status: "ok", updated_place: updatedPlace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
