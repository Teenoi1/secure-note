import { ERROR_CODES } from "../constants/errorCodes.js";
import { sendError } from "../utils/responseHandler.js";

export const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"] || req.query.api_key;

  const validApiKey = process.env.API_KEY;

  if (!apiKey) {
    return sendError(res, ERROR_CODES.MISSING_API_KEY);
  }

  if (!validApiKey) {
    console.error("❌ ERROR: API_KEY not configured in .env");
    return sendError(res, ERROR_CODES.API_KEY_NOT_CONFIGURED);
  }

  if (apiKey !== validApiKey) {
    return sendError(res, ERROR_CODES.INVALID_API_KEY);
  }

  next();
};

export default verifyApiKey;
