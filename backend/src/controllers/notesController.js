import Note from '../models/Note.js';

export async function getAllNotes (_, res)  { 
    //the above underscore (_) is used to indicate that the first parameter (req) is not used in this function
    try {
        const notes = await Note.find().sort({ createdAt: -1 }); 
        //get every notes, -1 sorts in desc. order with newest first
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getNoteById (req, res) {
    try {
        const note = await Note.findById(req.params.id); //get note by ID
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in getNoteById:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function createNote (req, res) {
    try {
        const {title,content} = req.body;
        const newNote = new Note({title,content});

        const saveNote = await newNote.save();
        res.status(201).json({ message: "Note created successfully" , note: saveNote });
    } catch (error) {
        console.error("Error in createNote:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//need the note ID to update a specific note
export async function updateNote (req, res) {
    
    try {
        const { title, content } = req.body;
        const { id } = req.params; // Extracting the note ID from the request parameters
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, content },
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error in updateNote:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function deleteNote (req, res) {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);

        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error in deleteNote:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

