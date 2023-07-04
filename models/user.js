import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, max: 1024 },
  lastName: { type: String, required: true, max: 1024 },
  email: { type: String, required: true, min: 5, max: 1024 },
  password: { type: String, required: true, min: 8, max: 1024 },
});

export default mongoose.model("User", userSchema);
