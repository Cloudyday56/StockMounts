import express from "express";
import notesRoutes from "./routes/notesRoutes.js";

// const express = require("express");
const app = express();

app.use("/api/notes", notesRoutes); // Middleware to parse JSON bodies
// app.use("/api/products", productRoutes);
// app.use("/api/whatever", whateverRoutes);

//An ENDPOINT is a combination of a URL + HTTP method 
// (like GET, POST, etc.) that allows clients to interact with the server.

app.listen(5001, () => {
    console.log("Server is running on port 5001");
});







