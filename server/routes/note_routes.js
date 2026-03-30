import express from "express";
import {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote
} from "../controllers/note_controller.js";
import {
    validateNoteInput,
    validateNoteUpdate,
    validateNoteId,
    validationErrorHandler
} from "../middlewares/validation.js";

const router = express.Router();

router.get("/", getNotes);

router.get("/:id", validateNoteId, validationErrorHandler, getNoteById);

router.post("/", validateNoteInput, validationErrorHandler, createNote);

router.put("/:id", validateNoteId, validateNoteUpdate, validationErrorHandler, updateNote);

router.delete("/:id", validateNoteId, validationErrorHandler, deleteNote);

export default router;  