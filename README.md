# 📓 Secure Note Web Application

Secure Note คือเว็บแอปพลิเคชันสำหรับสร้าง อ่าน แก้ไข และลบโน้ตได้อย่างเป็นระบบ โดยออกแบบให้ใช้งานง่าย แสดงผลรวดเร็ว และแบ่งโครงสร้างแบบแยกฝั่ง Frontend / Backend อย่างชัดเจน เพื่อให้ง่ายต่อการพัฒนาและดูแลต่อในอนาคต

## 🌏 Deployment

**Vercel**
- **Domains**: https://secure-note-roan.vercel.app
- **Deployment**: secure-note-k1dtb0tix-chayakorn-jaikunyas-projects.vercel.app

**Render**
- **Base API**: https://secure-note-72y0.onrender.com

---

## 🚀 Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS  
- **Backend:** Node.js (Express)  
- **Database:** MongoDB (Mongoose)  
- **Security & Utilities:** helmet, express-rate-limit, express-validator, cors, dotenv  

---

## Project Structure

```
secure-note/
├── client/                # Next.js Frontend
│   ├── app/               # App Router pages
│   ├── components/        # Reusable UI components
│   ├── services/          # API call logic
│   └── types/             # TypeScript definitions
└── server/                # Node.js Express Backend
    ├── config/            # Database connection
    ├── controllers/       # Business logic
    ├── models/            # Database schemas
    └── routes/            # API endpoints
```

---

## ✨ Features

- รองรับการทำงานแบบ **CRUD** ครบถ้วน: Create, Read, Update, Delete  
- หน้า Home แสดงรายการโน้ตทั้งหมด และสามารถจัดเรียงตาม Updated / Created / Title  
- สร้างโน้ตใหม่แล้ว redirect ไปหน้า detail อัตโนมัติ  
- โครงสร้าง backend แยกชั้น controller / service / route / middleware

---

---

## 🧩 How it works

- หน้า Home เรียก API เพื่อดึงโน้ตทั้งหมด  
- เมื่อสร้างโน้ตใหม่ ระบบจะสร้างค่าเริ่มต้น `Untitled` และ redirect ไป `/note/:id`  
- หน้า detail ใช้ dynamic route สำหรับดู/แก้ไขโน้ต  
- Backend ใช้ middleware สำหรับ security และ validation  

---

---

## 🔌 API Overview

| Method |   Endpoint  | Description |
|--------|-------------|-------------|
| GET    | /notes      | ดึงโน้ตทั้งหมด  |
| GET    | /notes/:id  | ดึงโน้ตตาม ID |
| POST   | /notes      | สร้างโน้ตใหม่  |
| PUT    | /notes/:id  | อัปเดตโน้ต    |
| DELETE | /notes/:id  | ลบโน้ต       |

---

---


## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/Teenoi1/secure-note.git
cd secure-note
```

### 2. 🖥️ Frontend Setup (Next.js)
```bash
cd frontend
npm 
```

### 3. 🔐 Create .env.local file
```
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SECRET_KEY=...
```

### 4. ▶️ Run Frontend
```bash
npm run dev
```

Frontend จะรันที่: http://localhost:3000

### 5. ⚙️ Backend Setup (Node.js + Express)
```bash
cd backend
npm install
```

### 6. 🔐 Create .env file
```
PORT=5001
MONGO_URI=your_mongodb_connection_string
SECRET_TOKEN=your_secret_token
```

### 7. ▶️ Run Backend
```bash
npm run dev
```

Backend จะรันที่: http://localhost:5000

---