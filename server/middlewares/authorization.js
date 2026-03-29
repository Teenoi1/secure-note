import { ERROR_CODES } from "../constants/errorCodes.js";
import { sendError } from "../utils/responseHandler.js";

export const authenticateAccessToken = (req, res, next) => {
  // Support both:
  // - `Authorization: Bearer <token>` (common)
  // - `?secret_key=<token>` (fallback)
  let secretKey = req.headers["authorization"] || req.query.secret_key;
  if (typeof secretKey === "string" && secretKey.toLowerCase().startsWith("bearer ")) {
    secretKey = secretKey.slice("bearer ".length).trim();
  }

  const validSecretKey = process.env.SECRET_KEY;

  if (!secretKey) {
    return sendError(res, ERROR_CODES.MISSING_TOKEN);
  }

  if (!validSecretKey) {
    console.error("❌ ERROR: SECRET_KEY not configured in .env");
    return sendError(res, ERROR_CODES.SECRET_KEY_NOT_CONFIGURED);
  }

  if (secretKey !== validSecretKey) {
    return sendError(res, ERROR_CODES.INVALID_TOKEN);
  }

  next();
};

export default authenticateAccessToken;
