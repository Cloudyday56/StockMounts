import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
  // Only return notes belonging to the authenticated user
  try {
    const notes = await Note.find({ owner: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      owner: req.userId,
    });
    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or access denied" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteById:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content, owner: req.userId });

    const saveNote = await newNote.save();
    res
      .status(201)
      .json({ message: "Note created successfully", note: saveNote });
  } catch (error) {
    console.error("Error in createNote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//need the note ID to update a specific note
export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const { id } = req.params;
    // Only allow update if the note belongs to the user
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, owner: req.userId },
      { title, content },
      { new: true }
    );
    if (!updatedNote) {
      return res
        .status(404)
        .json({ message: "Note not found or access denied" });
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteNote(req, res) {
  try {
    // Only allow delete if the note belongs to the user
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!deletedNote) {
      return res
        .status(404)
        .json({ message: "Note not found or access denied" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
