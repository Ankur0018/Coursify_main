# Coursify Backend

Coursify is a robust and scalable backend service for an online course platform. It provides secure authentication, course management, and purchase functionalities for both users and administrators.

## 🚀 Tech Stack
- **Node.js** - Backend runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JSON Web Tokens (JWT)** - Authentication
- **bcrypt** - Password hashing
- **Zod** - Input validation
- **cookie-parser** - Cookie handling
- **dotenv** - Environment variable management

## 📌 Features
### 👤 User Module
- **Signup/Login** with hashed password storage
- **JWT-based authentication** for secure sessions
- **Course purchases** and retrieval of purchased courses

### 🛠️ Admin Module
- **Admin authentication** using JWT
- **Create, update, and retrieve courses**
- **Only the creator admin can modify their courses**

### 📚 Course Module
- **Users can browse courses** before purchasing
- **Admins can manage courses** efficiently

## 📜 API Endpoints
### 🔑 Authentication
- `POST /api/v1/user/signup` - User signup
- `POST /api/v1/user/login` - User login
- `POST /api/v1/admin/signup` - Admin signup
- `POST /api/v1/admin/login` - Admin login

### 📦 Course Management
- `POST /api/v1/admin/course` - Create a course (Admin only)
- `PUT /api/v1/admin/course` - Update a course (Admin only)
- `GET /api/v1/admin/course` - Get courses created by admin
- `GET /api/v1/course/preview` - View all courses

### 💳 Purchase & User Actions
- `POST /api/v1/course/purchase` - Purchase a course
- `GET /api/v1/user/purchases` - Get purchased courses

## 🔧 Setup & Installation
1. Clone the repository:
   ```sh
   git clone [https://github.com/vipulsc/coursify.git
   cd coursify
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file:
   ```env
   ADMIN_SECRET=your_admin_secret
   USER_SECRET=your_user_secret
   NODE_ENV=development
   MONGO_URL=your_mongodb_connection_string
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

## 📌 Future Improvements
- Add **course content management** (videos, quizzes)
- Implement **role-based access control** for enhanced security
- Integrate **payment gateway** for course purchases


