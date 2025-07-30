import mongoose from "mongoose";

// 1. create schema
// 2. create model based on the schema

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: false,
    },
    profilePic: {
      type: String,
      default: "",
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubUsername: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", userSchema);

export default User;
