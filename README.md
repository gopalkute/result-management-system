# 📊 Result Management System (RMS)

A **web-based Result Management System** built with **MERN stack** (MongoDB, Express.js, React.js, Node.js) that simplifies how academic results are stored, managed, and accessed.  

---

## 🚀 Features
- 🔑 **Role-based Authentication**
  - **Admin** → Full control over all branches, users, and results  
  - **HOD** → Manage their own branch (students, results)  
  - **Student** → View only their own results securely  

- 📂 **Result Management**
  - Upload results (manual entry or via Excel file)  
  - Prevent duplicate entries (same student, year, semester)  
  - Easy search & filtering of results  

- 🏫 **User Management**
  - Manage **Admins, HODs, Students**  
  - Secure login with JWT authentication & refresh tokens  

- ⚡ **Tech Highlights**
  - **Backend**: Node.js, Express.js, MongoDB, Mongoose  
  - **Frontend**: React.js, Bootstrap CSS  
  - **Security**: Password hashing (bcryptjs), JWT-based authentication, cookie handling  

---

## 📌 Project Modules
1. **Authentication & Authorization**  
2. **Student Management**  
3. **Branch & roles Management**  
4. **Result Management** (with Excel import support)  
5. **Role-based Access Control**  

---

## 🛠️ Installation
```bash
# Clone repository
git clone https://github.com/gopalkute/result-management-system.git

# Backend setup
cd backend
npm install
create the .env file
add credential details in the .env file
npm start

# Frontend setup
cd frontend
npm install
npm start
```

---

## 🎯 Objective
- Eliminate manual errors in result handling  
- Provide fast & secure access to academic results  
- Reduce dependency on outdated result portals  

---

## 📸 Screenshots
(Add screenshots or GIFs of your dashboard, result table, login page etc.)  

---

## 🤝 Contribution
Pull requests are welcome. For major changes, please open an issue first to discuss.  
