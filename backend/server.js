// import express from 'express'

const express = require('express');
const app = express()


//An ENDPOINT is a combination of a URL + HTTP method 
// (like GET, POST, etc.) that allows clients to interact with the server.

//GET
app.get("/api/notes", (req, res) => {
    res.status(200).send("you got 10 notes");
});

//POST
app.post("/api/notes", (req, res) => {
    res.status(201).json({
        message: "Note created successfully",
    });
});

//PUT
app.put("/api/notes/:id", (req, res) => {
    res.status(200).json({
        message: "Note updated successfully",
    });
});

//DELETE
app.delete("/api/notes/:id", (req, res) => {
    res.status(200).json({
        message: "Note deleted successfully",
    });
});


app.listen(5001, () => {
    console.log("Server is running on port 5001");
});







