import { ERROR_CODES } from "../constants/errorCodes.js";
import { sendError } from "../utils/responseHandler.js";

export const detectBot = (req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";
  const acceptHeader = req.headers["accept"];

  // รายการ bot signatures ที่ต้อง block
  const botPatterns = [
    /curl/i,
    /wget/i,
    /python/i,
    /java(?!script)/i,
    /perl/i,
    /ruby/i,
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /nikto/i,
    /nmap/i,
    /nessus/i,
    /masscan/i,
    /sqlmap/i,
  ];

  // ตรวจสอบว่า User-Agent ตรงกับ bot patterns หรือไม่
  const isBot = botPatterns.some(pattern => pattern.test(userAgent));

  // ตรวจสอบ User-Agent ว่างเปล่า
  const hasNoUserAgent = !userAgent || userAgent.length === 0;

  if (isBot || hasNoUserAgent) {
    console.warn(`🚫 Bot detected from IP ${req.ip}: ${userAgent}`);
    return sendError(res, ERROR_CODES.BOT_DETECTED);
  }

  next();
};

// Block Security Scanners
export const blockSecurityScanners = (req, res, next) => {
  const url = req.url.toLowerCase();
  
  // URLs ที่มักจะ scanned โดย vulnerability scanners
  const suspiciousPatterns = [
    /admin/,
    /\.env/,
    /wp-admin/,
    /\.git/,
    /config/,
    /backup/,
    /\.sql/,
  ];

  const isSuspiciousUrl = suspiciousPatterns.some(pattern => pattern.test(url));

  if (isSuspiciousUrl) {
    console.warn(`🚨 Possible security scan attempt: ${req.method} ${req.url}`);
    return sendError(res, ERROR_CODES.NOT_FOUND);
  }

  next();
};

export default detectBot;
