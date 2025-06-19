
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
//   createdAt: {
//     type: Date,
//     default: Date.now, // Automatically sets the current date and time
//   },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});


const Note = mongoose.model("Note", noteSchema);

export default Note;
