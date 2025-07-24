import express from "express";
import {
  createNote,
  getAllNotes,
  updateNote,
  deleteNote,
  getNoteById,
} from "../controllers/notesController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getAllNotes);
router.get("/:id", verifyToken, getNoteById); //get note by ID
router.post("/", verifyToken, createNote);
router.put("/:id", verifyToken, updateNote);
router.delete("/:id", verifyToken, deleteNote);

export default router;
