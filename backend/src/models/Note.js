
import mongoose from "mongoose";

// 1. create schema
// 2. create model based on the schema

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  indicator: {
    type: String,
    enum: ["buy", "sell", "note"], // Restrict to specific values
    default: "note", // Default value if not specified
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
