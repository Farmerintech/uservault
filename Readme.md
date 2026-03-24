
---

# 🔐 Secure Cloud User Authentication System

## Undergraduate Research Project

A secure, scalable cloud-based user authentication and file management system built with **Node.js**, **Express** for backend, **MongoDB** for Database, and **React ** & **TypeScript** for frontend.

This project was developed as part of an undergraduate research study focused on designing and implementing a **secure authentication architecture suitable for cloud environments**, integrating **facial biometric verification** using **Luxand Cloud API**.

---

# 📌 Abstract

As cloud-based systems continue to grow, secure user authentication has become a critical challenge. Many applications suffer from weak password storage, unverified accounts, and reliance on single-layer authentication mechanisms.

This project presents a **multi-layer authentication framework** that combines:

* Password salting and hashing using bcrypt
* Email verification via OTP
* **Facial biometric capture and verification (Luxand Cloud)**
* JWT-based authorization (JSON_WEB_TOKEN)
* Encrypted password reset links
* Middleware-protected routes

The system ensures that **user identity is verified using both knowledge (password) and biometrics (face)** before access is granted.

---

# 🎯 Problem Statement

Many web and cloud applications face the following security problems:

1. ❌ Plain-text password storage
2. ❌ Weak hashing algorithms
3. ❌ No email ownership verification
4. ❌ Single-factor authentication (password only)
5. ❌ Unprotected API endpoints
6. ❌ Unauthorized access risks

These vulnerabilities expose users to:

* Account takeover attacks
* Credential theft
* Unauthorized system access
* Data breaches

This project addresses these issues by implementing a **secure multi-factor authentication system using facial recognition**.

---

# 🧠 Research Objectives

* Design a secure authentication architecture
* Implement password hashing with salting
* Enforce email verification before activation
* Capture and store facial biometric data at registration
* Implement facial verification during login
* Integrate Luxand Cloud for face recognition
* Implement JWT-based authentication
* Protect API routes using middleware

---

# 🏗 System Architecture Overview

The system consists of:

* Authentication Module
* Biometric Verification Module (Luxand Cloud)
* User Management Module
* File Management Module
* Middleware Layer
* Email Service Layer
* MongoDB Database

---

# 🔄 Authentication Flow (Exact System Flow)

### 📝 Registration Phase

1. User registers (email + password)
2. Password is salted and hashed
3. OTP is generated and sent to email
4. User verifies email
5. **User face is captured and stored (via Luxand Cloud)**

---

### 🔐 Login Phase

1. User inputs email and password
2. System validates credentials

   * ❌ Invalid → error → access denied
3. **System captures a new face image during login**
4. **Captured face is compared with stored face (Luxand Cloud)**

   * ❌ Not matched → log attempt → error → access denied
   * ✅ Match → proceed
5. Authentication token (JWT) is generated
6. Session is created and audit event is logged
7. Access is granted

---

# 🔐 Security Design & Implementation

## 1️⃣ Password Salting and Hashing (bcrypt)

When a user registers:

```ts
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

### Why Salting is Necessary

* Prevents identical password hashes
* Protects against rainbow table attacks
* Increases resistance to brute-force attacks

### Why bcrypt?

* Adaptive hashing
* Built-in salting
* Industry standard

---

## 2️⃣ Email Verification via OTP

After registration:

* A 6-digit OTP is generated
* Sent to user's email
* User must verify before account activation

### Benefits

* Prevents fake accounts
* Ensures ownership of email
* Improves system integrity

---

## 3️⃣ Facial Biometric Authentication (Luxand Cloud)

### 📌 Registration (Face Capture)

* User’s face is captured using device camera
* Image is sent to **Luxand Cloud API**
* A **face token / descriptor** is generated
* Stored securely in the database

---

### 📌 Login (Face Verification)

* A new face image is captured
* Sent to Luxand Cloud
* Compared against stored facial data

---

## 🧠 How Face Similarity Works

Facial recognition systems like Luxand use **AI-based feature extraction**:

1. The face image is analyzed

2. Key facial landmarks are detected:

   * Eyes
   * Nose
   * Mouth
   * Jawline

3. These features are converted into a **numerical vector (face embedding)**

4. During login:

   * New face → converted to embedding
   * Stored face → already has embedding
   * System computes **similarity score**

---

### 📊 Similarity Score

* Value between **0 and 1** (or percentage)
* Example:

```
0.95 → Very high match (same person)
0.60 → Low confidence
```

---

### ✅ Decision Rule

```ts
if (similarityScore >= 0.85) {
  // Accept login
} else {
  // Reject login
}
```

---

### Why Facial Recognition?

* Adds **biometric security layer**
* Prevents unauthorized login even if password is stolen
* Unique to each user
* Hard to replicate

---

## 4️⃣ JWT-Based Authentication

After successful authentication:

```ts
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "1d"
});
```

### Benefits

* Stateless authentication
* Scalable for cloud systems
* Secure API communication

---

## 5️⃣ Session Creation & Audit Logging

After login:

* Session is created
* Login activity is recorded

### Why Important?

* Tracks user activity
* Helps detect suspicious behavior
* Supports auditing

---

## 6️⃣ Secure Password Reset Mechanism

* Reset OTP is generated
* Encrypted into `resetId`
* Sent via email

```
https://yourfrontend.com/reset-password?resetId=encryptedToken
```

### Benefits

* Prevents OTP exposure
* Protects against tampering
* Ensures secure recovery

---

## 7️⃣ Route Protection (Middleware)

```ts
authMiddleWare
```

Middleware:

* Verifies JWT
* Attaches user to request
* Blocks unauthorized access

---

# 📂 Project Structure

```
src/
│
├── controllers/
│   ├── auth.ts
│   ├── user.ts
│   └── file.ts
│
├── routes/
│   ├── authRoute.ts
│   ├── userRoute.ts
│   └── fileRoute.ts
│
├── middlewares/
│   └── authMiddleware.ts
│
├── models/
│   └── userModel.ts
│
└── server.ts
```

---

# 🛠 Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* TypeScript
* bcrypt
* JSON Web Token (JWT)
* Luxand Cloud API (Facial Recognition)
* Nodemailer / Resend

---

# 📊 Security Features Implemented

✔ Password hashing with salt
✔ Email verification (OTP)
✔ **Facial biometric authentication (Luxand Cloud)**
✔ JWT authentication
✔ Protected API routes
✔ Encrypted password reset
✔ Audit logging

---

# 🚀 Installation

```bash
git clone https://github.com/your-username/secure-cloud-user.git
cd secure-cloud-user
cd backend
npm install
cd frontend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
LUXAND_API_KEY=your_luxand_key
```

Run:

```bash
npm run dev
```

---

# 🧪 Testing Considerations

Future improvements may include:

* Unit testing (Jest)
* API testing (Supertest)
* Rate limiting
* Multi-factor authentication (OTP fallback)
* Liveness detection (anti-spoofing)

---

# 📈 Contribution to Research

This project demonstrates:

* Integration of **biometric authentication into cloud systems**
* Practical implementation of **multi-factor security**
* Secure identity verification using **AI-based facial recognition**
* Cloud-ready authentication architecture

---

# 📌 Conclusion

The Secure Cloud User Authentication System implements a **multi-layer authentication model** combining:

* Password-based authentication
* Facial biometric verification
* JWT authorization
* Secure session handling

By verifying both **credentials and biometric identity**, the system ensures **high-level security suitable for modern cloud applications**.

---

# 👨‍🎓 Author

IDRIZ
Undergraduate Research Project

---


