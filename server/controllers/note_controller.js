import { 
  createNoteService, 
  getNotesService, 
  getNoteByIdService, 
  updateNoteService, 
  deleteNoteService 
} from "../services/note_service.js";
import { ERROR_CODES, SUCCESS_CODES } from "../constants/errorCodes.js";
import { sendError, sendSuccess, sendData } from "../utils/responseHandler.js";

// Create a new note
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = await createNoteService(title, content);
    return sendData(res, 201, newNote, "Note created successfully");
  } catch (error) {
    console.error("Create Note Error:", error.message);
    return sendError(res, ERROR_CODES.CREATE_NOTE_ERROR, { error: error.message });
  }
};

// Get all notes
export const getNotes = async (req, res) => {
  try {
    const notes = await getNotesService();
    return sendData(res, 200, notes, "Notes fetched successfully");
  } catch (error) {
    console.error("Fetch Notes Error:", error.message);
    return sendError(res, ERROR_CODES.FETCH_NOTES_ERROR, { error: error.message });
  }
};

// Get by ID
export const getNoteById = async (req, res) => {
  try {
    const note = await getNoteByIdService(req.params.id);
    if (!note) {
      return sendError(res, ERROR_CODES.NOTE_NOT_FOUND);
    }
    return sendData(res, 200, note);
  } catch (error) {
    console.error("Fetch Note Error:", error.message);
    return sendError(res, ERROR_CODES.FETCH_NOTE_ERROR, { error: error.message });
  }
};

// Update a note
export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;

    const updatedNote = await updateNoteService(id, title, content);
    if (!updatedNote) {
      return sendError(res, ERROR_CODES.NOTE_NOT_FOUND);
    }
    return sendData(res, 200, updatedNote, "Note updated successfully");
  } catch (error) {
    console.error("Update Note Error:", error.message);
    return sendError(res, ERROR_CODES.UPDATE_NOTE_ERROR, { error: error.message });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await deleteNoteService(id);
    
    if (!deletedNote) {
      return sendError(res, ERROR_CODES.NOTE_NOT_FOUND);
    }

    return sendSuccess(res, ERROR_CODES.DELETED_SUCCESSFULLY);
  } catch (error) {
    console.error("Delete Note Error:", error.message);
    return sendError(res, ERROR_CODES.DELETE_NOTE_ERROR, { error: error.message });
  }
};