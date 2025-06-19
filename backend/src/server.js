import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file


// const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

//middleware
app.use(express.json()); //before routes to parse JSON bodies

app.use("/api/notes", notesRoutes); // Middleware to parse JSON bodies
// app.use("/api/products", productRoutes);
// app.use("/api/whatever", whateverRoutes);

//An ENDPOINT is a combination of a URL + HTTP method 
// (like GET, POST, etc.) that allows clients to interact with the server.

app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
});






