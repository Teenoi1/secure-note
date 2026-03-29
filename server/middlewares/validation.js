import { body, param, validationResult } from "express-validator";
import { sendValidationError } from "../utils/responseHandler.js";

// Validation Rules สำหรับ Note
export const validateNoteInput = [
  body("title")
    .trim()
    .default("Untitled Note")
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters")
    .escape(),
  
  body("content")
    .trim()
    .default("")
    .notEmpty().withMessage("Content is required")
    .isLength({ min: 1, max: 10000 })
    .withMessage("Content must be between 1 and 10000 characters")
    .escape(),
];

// Validation สำหรับ Update
export const validateNoteUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters")
    .escape(),
  
  body("content")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100000 })
    .withMessage("Content must be between 1 and 100000 characters")
    .escape(),
];

// Validation สำหรับ ID (MongoDB ObjectId)
export const validateNoteId = [
  param("id")
    .isMongoId().withMessage("Invalid Note ID format"),
];

// Middleware สำหรับตรวจสอบ validation results
export const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return sendValidationError(res, errors.array());
  }
  
  next();
};

export default {
  validateNoteInput,
  validateNoteUpdate,
  validateNoteId,
  validationErrorHandler,
};
