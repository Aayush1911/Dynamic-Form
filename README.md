# 🧾 Dynamic Form Builder with Role-Based Access

This is a full-stack web application where admins can create dynamic forms, assign access to specific users, and manage form submissions securely. Users can fill and edit forms based on their role and access permissions.


## 📌 Features

- 🧑‍💼 **Admin Dashboard**
  - Create dynamic forms with custom fields
  - Assign form access to specific users
  - View, edit, delete form responses
  - Download responses in PDF

- 👤 **User Panel**
  - Secure login with JWT authentication
  - Access assigned forms only
  - Submit and edit responses

- 🔐 **Role-Based Access Control**
  - Only authorized users can access and submit forms
  - Admin has full control over all forms and data

---

## 🛠️ Tech Stack

### 🔹 Frontend
- React.js
- Axios
- Material UI

### 🔹 Backend
- Node.js
- Express.js
- JWT for Authentication

### 🔹 Database
- MongoDB (Mongoose ODM)

---

## 📁 Folder Structure

```bash
├── client/                   # Frontend (React)
│   └── src/
│       ├── components/
│       ├── pages/
│       └── context/
├── server/                   # Backend (Node + Express)
│   ├── routes/
│   ├── controllers/
│   └── models/
├── .env
├── package.json
└── README.md
