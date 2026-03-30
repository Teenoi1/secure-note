export const ERROR_CODES = {
  // 400 - Bad Request (Validation errors)
  VALIDATION_ERROR: {
    status: 400,
    message: "Validation error",
    code: "VALIDATION_ERROR"
  },

  // 401 - Unauthorized (Missing credentials)
  MISSING_TOKEN: {
    status: 401,
    message: "Token is required",
    code: "MISSING_TOKEN"
  },

  // 403 - Forbidden (Invalid credentials or permissions)
  INVALID_TOKEN: {
    status: 403,
    message: "Invalid token",
    code: "INVALID_TOKEN"
  },

  PERMISSION_DENIED: {
    status: 403,
    message: "Permission denied",
    code: "PERMISSION_DENIED"
  },

  BOT_DETECTED: {
    status: 403,
    message: "Access denied - Automated requests are not allowed",
    code: "BOT_DETECTED"
  },

  // 404 - Not Found
  NOT_FOUND: {
    status: 404,
    message: "Not found",
    code: "NOT_FOUND"
  },

  NOTE_NOT_FOUND: {
    status: 404,
    message: "Note not found",
    code: "NOTE_NOT_FOUND"
  },

  ROUTE_NOT_FOUND: {
    status: 404,
    message: "Route not found",
    code: "ROUTE_NOT_FOUND"
  },

  // 500 - Internal Server Error
  INTERNAL_ERROR: {
    status: 500,
    message: "Internal server error",
    code: "INTERNAL_ERROR"  
  },

  SECRET_KEY_NOT_CONFIGURED: {
    status: 500,
    message: "Server configuration error - token not set",
    code: "TOKEN_NOT_CONFIGURED"
  },

  CREATE_NOTE_ERROR: {
    status: 500,
    message: "Failed to create note",
    code: "CREATE_NOTE_ERROR"
  },

  FETCH_NOTES_ERROR: {
    status: 500,
    message: "Failed to fetch notes",
    code: "FETCH_NOTES_ERROR"
  },

  FETCH_NOTE_ERROR: {
    status: 500,
    message: "Failed to fetch note",
    code: "FETCH_NOTE_ERROR"
  },

  UPDATE_NOTE_ERROR: {
    status: 500,
    message: "Failed to update note",
    code: "UPDATE_NOTE_ERROR"
  },

  DELETE_NOTE_ERROR: {
    status: 500,
    message: "Failed to delete note",
    code: "DELETE_NOTE_ERROR"
  },
};

export const SUCCESS_CODES = {
  // 200 - OK
  OK: {
    status: 200,
    message: "Success",
    code: "OK"
  },

  NOTES_FETCHED: {
    status: 200,
    message: "Notes fetched successfully",
    code: "NOTES_FETCHED"
  },

  DELETED_SUCCESSFULLY: {
    status: 200,
    message: "Deleted successfully",
    code: "DELETED_SUCCESSFULLY"
  },

  // 201 - Created
  CREATED: {
    status: 201,
    message: "Created successfully",
    code: "CREATED"
  },

  NOTE_CREATED: {
    status: 201,
    message: "Note created successfully",
    code: "NOTE_CREATED"
  },
};

export default {
  ERROR_CODES,
  SUCCESS_CODES
};
