import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import noteRoutes from "./routes/note_routes.js";

// Import all security middleware
import { securityHeaders } from "./middlewares/security.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import { detectBot, blockSecurityScanners } from "./middlewares/botDetection.js";
import { verifyApiKey } from "./middlewares/authorization.js";

// Import error codes and response handlers
import { ERROR_CODES } from "./constants/errorCodes.js";
import { sendError } from "./utils/responseHandler.js";

dotenv.config();

// Validate Required Environment Variables
if (!process.env.API_KEY) {
  console.error("❌ FATAL ERROR: API_KEY is not set in .env file");
  console.error("   Please add: API_KEY=your-secret-key to .env");
  process.exit(1);
}

const app = express();

// Security Headers
app.use(securityHeaders);

// Bot Detection
app.use(detectBot);
app.use(blockSecurityScanners);

// Rate Limiting
app.use(generalLimiter);

// CORS Configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "x-api-key", "x-user-role"]
}));

// Parse JSON (with size limit)
app.use(express.json({ limit: "10kb" }));

// API Key Verification
app.use(verifyApiKey);

// Request Logging
app.use((req, res, next) => {
  console.log(`📨 ${new Date().toISOString()} - ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Connect to MongoDB
connectDB();

// Routes
app.use("/notes", noteRoutes);

// 404 Handler
app.use((req, res) => {
  sendError(res, ERROR_CODES.ROUTE_NOT_FOUND);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  const statusCode = err.status || 500;
  const message = err.message || ERROR_CODES.INTERNAL_ERROR.message;
  
  res.status(statusCode).json({
    status_code: statusCode,
    message,
    code: err.code || "INTERNAL_ERROR"
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(` 🏇 Server is running on port ${PORT}`);
    console.log(`📌 All security middleware is active!`);
    console.log(`✅ API_KEY is configured`);
});