
import express from "express";
import { createNote, getAllNotes, updateNote, deleteNote, getNoteById } from "../controllers/notesController.js";


const router = express.Router();

router.get("/", getAllNotes);
router.get("/:id", getNoteById); //get note by ID
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;

