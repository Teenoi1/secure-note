import { ERROR_CODES, SUCCESS_CODES } from "../constants/errorCodes.js";

// Send Error Response
export const sendError = (res, errorCode, additionalData = null) => {
  const { status, message, code } = errorCode;
  
  const response = {
    status_code: status,
    message,
    code,
    ...(additionalData && { ...additionalData })
  };

  return res.status(status).json(response);
};

// Send Success Response
export const sendSuccess = (res, successCode, data = null) => {
  const { status, message, code } = successCode;
  
  const response = {
    status_code: status,
    message,
    code,
    ...(data && { data })
  };

  return res.status(status).json(response);
};

// Send Data with Custom Message
export const sendData = (res, statusCode, data, message = "Success") => {
  return res.status(statusCode).json({
    status_code: statusCode,
    message,
    data
  });
};

// Validation Error Helper
export const sendValidationError = (res, errors) => {
  return res.status(400).json({
    status_code: 400,
    message: ERROR_CODES.VALIDATION_ERROR.message,
    code: ERROR_CODES.VALIDATION_ERROR.code,
    errors: errors.map(err => ({
      field: err.param,
      message: err.msg
    }))
  });
};

// Send Rate Limit Error
export const sendRateLimitError = (res, limitType = "general") => {
  const errorCode = limitType === "notes" 
    ? ERROR_CODES.TOO_MANY_NOTES
    : limitType === "deletions"
    ? ERROR_CODES.TOO_MANY_DELETIONS
    : ERROR_CODES.RATE_LIMIT_EXCEEDED;

  return sendError(res, errorCode);
};

// Send Permission Error
export const sendPermissionError = (res, userRole, action) => {
  return sendError(res, ERROR_CODES.PERMISSION_DENIED, {
    details: `${userRole} cannot ${action}`
  });
};

export default {
  sendError,
  sendSuccess,
  sendData,
  sendValidationError,
  sendRateLimitError,
  sendPermissionError
};
