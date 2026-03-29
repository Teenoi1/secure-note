import helmet from "helmet";

// Security Headers Middleware
// เพิ่ม HTTP security headers ป้องกันการโจมตี
export const securityHeaders = helmet({
  // ป้องกัน clickjacking attacks
  frameguard: { action: "deny" },
  
  // บังคับใช้ HTTPS และเก็บ HSTS
  hsts: { 
    maxAge: 31536000, // 1 ปี
    includeSubDomains: true,
    preload: true
  },
  
  // ป้องกัน XSS attacks
  xssFilter: true,
  
  // ป้องกันการเดาประเภทไฟล์
  noSniff: true,
  
  // ปิดการเปิดเผย server information
  hidePoweredBy: true,
  
  // ควบคุม Referrer Policy
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

export default securityHeaders;
