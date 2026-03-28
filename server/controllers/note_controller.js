import { Note } from "../models/note_model.js";

// Create a new note
export const createNote = async (req, res) => {
  try {
    const { content } = req.body;

    const newNote = new Note({ content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ 
        status_code: 500,
        message: "Failed to create note",
        error: error.message 
    });
  }
};

// Get all notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ created_at: -1 });
    //res.json(notes);
    res.status(200).json({
        status_code: 200,
        data: notes,
    });
  } catch (error) {
    res.status(500).json({ 
        status_code: 500,
        message: "Failed to fetch notes",
        error: error.message
    });
  }
};

// Get by ID
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ 
        status_code: 404,
        message: "Note not found",
        error: error.message
      });
    }
    res.status(200).json({
        status_code: 200,
        data: note,
    });
  } catch (error) {
    res.status(500).json({ 
        status_code: 500,
        message: "Failed to fetch note",
        error: error.message
    });
  }
};

// Update a note
export const updateNote = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { content,
        updated_at: Date.now()
      },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ 
        status_code: 404,
        message: "Note not found",
        error: error.message
      });
    }
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ 
        status_code: 500,
        message: "Failed to update note",
        error: error.message
    });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNote = await Note.findByIdAndDelete(id);
    
    if (!deletedNote) {
      return res.status(404).json({ 
        status_code: 404,
        message: "Note not found",
        error: error.message
     });
    }

    res.status(200).json({ 
        status_code: 200,
        message: "Deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
        status_code: 500,
        message: "Failed to delete note",
        error: error.message
    });
  }
};