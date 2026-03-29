import { Note } from "../models/note_model.js";

// Create a new note
export const createNoteService = async (title, content) => {
  const newNote = new Note({ title, content });
  await newNote.save();
  return newNote;
};

// Get all notes
export const getNotesService = async () => {
  const notes = await Note.find().sort({ updated_at: -1 });
  return notes;
};

// Get note by ID
export const getNoteByIdService = async (id) => {
  const note = await Note.findById(id);
  return note;
};

// Update a note
export const updateNoteService = async (id, title, content) => {
  const updatedNote = await Note.findByIdAndUpdate(
    id,
    { title, content, updated_at: Date.now() },
    { returnDocument: 'after' }
  );
  return updatedNote;
};

// Delete a note
export const deleteNoteService = async (id) => {
  const deletedNote = await Note.findByIdAndDelete(id);
  return deletedNote;
};