# 📋 Error Codes & Response Handling Architecture

## ✅ โครงสร้าง (Centralized Error Management)

### 1️⃣ **constants/errorCodes.js** 
ศูนย์กลางสำหรับเก็บ error codes และ messages ทั้งหมด

```javascript
export const ERROR_CODES = {
  MISSING_API_KEY: { status: 401, message: "...", code: "..." },
  INVALID_API_KEY: { status: 403, message: "...", code: "..." },
  NOTE_NOT_FOUND: { status: 404, message: "...", code: "..." },
  // ... อื่นๆ
}

export const SUCCESS_CODES = {
  OK: { status: 200, message: "Success", code: "OK" },
  NOTE_CREATED: { status: 201, message: "...", code: "..." },
  // ... อื่นๆ
}
```

---

### 2️⃣ **utils/responseHandler.js**
Helper functions สำหรับส่ง responses

```javascript
// ✅ ส่ง error response
sendError(res, ERROR_CODES.NOTE_NOT_FOUND)

// ✅ ส่ง success response
sendSuccess(res, SUCCESS_CODES.OK)

// ✅ ส่ง data với status code
sendData(res, 200, data, "Custom message")

// ✅ Validation errors
sendValidationError(res, errors)

// ✅ Rate limit errors
sendRateLimitError(res, "notes")

// ✅ Permission errors
sendPermissionError(res, "viewer", "create")
```

---

### 3️⃣ **Middlewares** - ใช้ Error Codes
- **authorization.js** - ตรวจสอบ API Key
- **validation.js** - ตรวจสอบ input
- **botDetection.js** - จับบ bot
- **rateLimiter.js** - จำกัด requests
- **security.js** - Headers protection

---

### 4️⃣ **Controllers** - ใช้ Response Handlers
- **note_controller.js** - CRUD operations

---

## 📊 Error Flow Diagram

```
Request
  ↓
Bot Detection (sendError if bot detected)
  ↓
Rate Limiter (sendRateLimitError if exceeded)
  ↓
API Key Verification (sendError if invalid)
  ↓
Validation (sendValidationError if invalid)
  ↓
Controller (sendData/sendSuccess/sendError)
  ↓
Response
```

---

## ✅ Benefits

| ประเด็น | ก่อน | หลัง |
|---------|------|------|
| **Error Messages** | กระจายไปทั่ว | ศูนย์กลาง (1 ไฟล์) |
| **Consistency** | ไม่สม่ำเสมอ | Unified format |
| **Maintenance** | ยุ่งยาก | ง่าย (แก้ 1 ที่) |
| **Reusability** | ต่ำ | สูง |
| **Code Duplication** | มี | ไม่มี |

---

## 🔄 ตัวอย่างการใช้

### ❌ Create Note ล้มเหลว
```javascript
// Before
res.status(500).json({
  status_code: 500,
  message: "Failed to create note",
  error: error.message
});

// After
sendError(res, ERROR_CODES.CREATE_NOTE_ERROR, { error: error.message });
```

### ✅ Fetch Notes สำเร็จ
```javascript
// Before
res.status(200).json({
  status_code: 200,
  notes: notes,
});

// After
sendData(res, 200, notes, "Notes fetched successfully");
```

### 🔑 Missing API Key
```javascript
// Before
return res.status(401).json({
  status_code: 401,
  message: "API key is required"
});

// After
return sendError(res, ERROR_CODES.MISSING_API_KEY);
```

---

## 📁 File Structure

```
server/
├── constants/
│   └── errorCodes.js          ← Error & Success codes
├── utils/
│   └── responseHandler.js      ← Helper functions
├── middlewares/
│   ├── authorization.js        ← Uses sendError
│   ├── validation.js           ← Uses sendValidationError
│   ├── botDetection.js         ← Uses sendError
│   ├── rateLimiter.js          ← Uses ERROR_CODES
│   └── security.js
├── controllers/
│   └── note_controller.js      ← Uses sendData/sendError
├── services/
│   └── note_service.js
├── routes/
│   └── note_routes.js
└── index.js                     ← Uses sendError
```

---

## 🧪 ทดสอบ

### 1. ไม่มี API Key
```bash
curl http://localhost:5001/notes
# Response: 401 MISSING_API_KEY
```

### 2. API Key ผิด
```bash
curl -H "x-api-key: wrong-key" http://localhost:5001/notes
# Response: 403 INVALID_API_KEY
```

### 3. Validation Error
```bash
curl -X POST http://localhost:5001/notes \
  -H "x-api-key: correct-key" \
  -H "Content-Type: application/json" \
  -d '{"title": "", "content": "test"}'
# Response: 400 VALIDATION_ERROR
```

### 4. จำกัด Requests (Rate Limit)
```bash
for i in {1..21}; do
  curl -X POST http://localhost:5001/notes \
    -H "x-api-key: correct-key" \
    -H "Content-Type: application/json" \
    -d '{"title": "Test", "content": "test"}'
done
# Response: 429 TOO_MANY_NOTES
```

### 5. Note Not Found
```bash
curl -H "x-api-key: correct-key" \
     http://localhost:5001/notes/invalid-id
# Response: 404 NOTE_NOT_FOUND
```

---

## 💡 อัปเดต Error Code

### ก่อน (กระจายไปทั่ว)
```javascript
// authorization.js
return res.status(403).json({ message: "Invalid API key" });

// controllers/note_controller.js
return res.status(404).json({ message: "Note not found" });

// validation.js
return res.status(400).json({ message: "Validation error" });
```

### หลัง (ศูนย์กลาง)
```javascript
// constants/errorCodes.js
INVALID_API_KEY: { status: 403, message: "Invalid API key" }
NOTE_NOT_FOUND: { status: 404, message: "Note not found" }
VALIDATION_ERROR: { status: 400, message: "Validation error" }

// ใช้ที่ไหนก็ได้
import { ERROR_CODES } from "../constants/errorCodes.js";
sendError(res, ERROR_CODES.INVALID_API_KEY);
```

---

## 🎯 สุดท้าย

✅ **ทั้งหมด Error Codes อยู่ 1 ไฟล์**
✅ **ทั้งหมด Response Handlers อยู่ 1 ไฟล์**
✅ **Code สะอาด, DRY, และง่ายต่อการดูแล**
