import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  place_id: {
    type: String,
    required: true,
  },
  fuel_price: {
    type: String,
    required: true,
  },
  isOpenNow: {
    type: String,
    required: true,
  },
  working_hours: { type: String, required: false },
});
export default mongoose.model("Place", placeSchema);
