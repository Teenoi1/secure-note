import rateLimit from "express-rate-limit";
import { ERROR_CODES } from "../constants/errorCodes.js";

// General Rate Limiting
// จำกัด requests ทั่วไป 100 ครั้งต่อ 15 นาที ต่อ IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 นาที
  max: 100, // จำกัด 100 requests
  message: {
    status_code: ERROR_CODES.RATE_LIMIT_EXCEEDED.status,
    message: ERROR_CODES.RATE_LIMIT_EXCEEDED.message,
    code: ERROR_CODES.RATE_LIMIT_EXCEEDED.code
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === "127.0.0.1", // ข้าม localhost
});

// Strict Rate Limiting สำหรับการสร้าง Note
// จำกัด 20 ครั้งต่อ 15 นาที
export const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    status_code: ERROR_CODES.TOO_MANY_NOTES.status,
    message: ERROR_CODES.TOO_MANY_NOTES.message,
    code: ERROR_CODES.TOO_MANY_NOTES.code
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict Rate Limiting สำหรับการลบ Note
export const deleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // จำกัด 30 deletes ต่อ 15 นาที
  message: {
    status_code: ERROR_CODES.TOO_MANY_DELETIONS.status,
    message: ERROR_CODES.TOO_MANY_DELETIONS.message,
    code: ERROR_CODES.TOO_MANY_DELETIONS.code
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default generalLimiter;
