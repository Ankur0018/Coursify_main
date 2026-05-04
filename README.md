# Coursify

A full-stack online course marketplace where students can browse and enroll in courses, and instructors can create and manage their own course catalog.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Roles & Permissions](#roles--permissions)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)

---

## Overview

Coursify is a full-stack MERN application. The backend is an Express.js REST API connected to MongoDB Atlas. The frontend is a React + Vite SPA styled with Tailwind CSS. In production, the Express server builds and serves the React app as static files from the `/public` directory.

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js v5 | Web framework |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens (JWT) | Authentication |
| bcrypt | Password hashing |
| Zod | Request validation |
| cookie-parser | HTTP cookie handling |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icon library |
| Context API | Global auth state |

---

## Features

### Students
- Sign up and log in with secure hashed passwords
- Browse all available courses on the homepage
- Purchase (enroll in) any course
- View all enrolled courses in a personal dashboard
- Protected routes — redirected to login if not authenticated

### Instructors
- Sign up and log in as an instructor
- Create new courses with title, description, price, and image
- Edit and delete their own courses
- View all courses they have created in a dedicated dashboard
- Cannot modify courses created by other instructors

### General
- JWT authentication via HTTP-only cookies (7-day expiry)
- Automatic role-based routing after login
- Responsive UI built with Tailwind CSS
- Input validation on both client and server using Zod
- Single unified auth system — no separate admin model

---

## Project Structure

```
coursify/
├── src/                        # Express backend
│   ├── app.js                  # Entry point, middleware, server boot
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── middlewares/
│   │   ├── auth.js             # JWT verification + requireRole
│   │   ├── userAuth.js
│   │   └── adminAuth.js
│   ├── models/
│   │   ├── User.js             # User schema (student | instructor)
│   │   ├── Course.js           # Course schema
│   │   └── Purchase.js         # Enrollment/purchase schema
│   ├── routes/
│   │   ├── auth.js             # /signup /login /logout /me
│   │   ├── courses.js          # Course CRUD
│   │   └── purchases.js        # Enroll + view purchases
│   └── utils/
│       └── validation.js       # Zod schemas
│
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx            # React entry point
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── CourseCard.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx          # Student dashboard
│   │   │   └── InstructorDashboard.jsx
│   │   └── lib/
│   │       └── api.js          # Centralized fetch wrapper
│   └── vite.config.js          # Vite config + dev proxy
│
├── public/                     # Built frontend (generated, git-ignored)
├── .env                        # Local environment variables (git-ignored)
├── .env.example                # Template for environment variables
├── .gitignore
├── package.json
└── Procfile                    # For Heroku/Render process declaration
```

---

## Prerequisites

Make sure you have the following installed before running the project:

- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org)
- **npm** v8 or higher (comes with Node.js)
- **Git** — [git-scm.com](https://git-scm.com)
- **MongoDB Atlas account** (free) — [cloud.mongodb.com](https://cloud.mongodb.com)

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/coursify.git
cd coursify
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
cd ..
```

### 4. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and add your values (see [Environment Variables](#environment-variables) below).

### 5. Start the development servers

Open two terminal windows:

**Terminal 1 — Backend (Express on port 3000):**
```bash
npm run dev
```

**Terminal 2 — Frontend (Vite on port 5173):**
```bash
npm run client
```

Then open **http://localhost:5173** in your browser.

> The Vite dev server proxies all `/api` requests to `http://localhost:3000` automatically, so you don't need to configure CORS for local development.

### 6. Build for production (optional, local test)

This builds the React app into `/public` and lets Express serve everything:

```bash
npm run build
npm start
```

Then open **http://localhost:3000**.

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB Atlas connection string
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/coursify?retryWrites=true&w=majority

# JWT secret — used to sign and verify all user tokens
JWT_SECRET=your_strong_random_secret_here

# Fallback JWT secret key (legacy support)
USER_SECRET=your_user_jwt_secret_here

# Frontend URL — used by Express CORS in production
# Leave blank for local dev
FRONTEND_URL=
```

**How to generate secure secret values:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this twice — use one value for `JWT_SECRET` and one for `USER_SECRET`.

---

## Available Scripts

Run these from the **project root**:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Express backend with nodemon (auto-restart on changes) |
| `npm run client` | Start Vite frontend dev server |
| `npm run build` | Build the React frontend into `/public` |
| `npm start` | Start Express in production mode (serves built frontend) |

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Auth — `/api/v1/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/signup` | Public | Register a new user (student or instructor) |
| POST | `/auth/login` | Public | Log in and receive JWT cookie |
| POST | `/auth/logout` | Public | Clear JWT cookie |
| GET | `/auth/me` | Authenticated | Get current logged-in user |

**Signup request body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "student"
}
```

**Login request body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

---

### Courses — `/api/v1/courses`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/courses` | Public | Get all courses |
| GET | `/courses/:id` | Public | Get a single course by ID |
| GET | `/courses/mine` | Instructor | Get courses created by the logged-in instructor |
| POST | `/courses` | Instructor | Create a new course |
| PUT | `/courses/:id` | Instructor | Update own course |
| DELETE | `/courses/:id` | Instructor | Delete own course |

**Create/Update course request body:**
```json
{
  "title": "JavaScript Mastery",
  "description": "Learn JavaScript from scratch to advanced.",
  "price": 999,
  "imageUrl": "https://example.com/image.jpg"
}
```

---

### Purchases — `/api/v1/purchases`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/purchases` | Student | Enroll in a course |
| GET | `/purchases` | Student | Get all enrolled courses |

**Enroll request body:**
```json
{
  "courseId": "64abc123def456"
}
```

---

## Roles & Permissions

The app has two user roles defined at signup:

| Role | Can Do |
|------|--------|
| `student` | Browse courses, enroll in courses, view their purchases |
| `instructor` | Create courses, edit/delete their own courses, view their course list |

- Role is stored in the JWT and verified on every protected request via the `requireRole` middleware.
- An instructor cannot enroll as a student and vice versa (enforced server-side).
- An instructor can only edit or delete courses they created (ownership check in DB query).

---

## Deployment

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/coursify.git
git push -u origin main
```

---

### Step 2 — Deploy Backend to Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Root Directory:** *(leave blank)*
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add these environment variables in Render dashboard:

| Key | Value |
|-----|-------|
| `MONGO_URL` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong random string |
| `USER_SECRET` | Another strong random string |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Your Vercel URL (add after Vercel deploy) |

5. Click **Deploy** — your API will be live at `https://coursify-api.onrender.com`

---

### Step 3 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Configure:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://coursify-api.onrender.com` |

5. Click **Deploy** — your frontend will be live at `https://coursify.vercel.app`

---

### Step 4 — Wire them together

Go back to Render and update `FRONTEND_URL` to your Vercel URL, then redeploy. This fixes the CORS policy so the frontend can talk to the backend.

---

### MongoDB Atlas — Allow all IPs

In Atlas → **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`). Required because Render uses dynamic IPs.

---

### Architecture

```
User's Browser
     |
     v
 Vercel (React SPA)
     |  (API calls to)
     v
 Render (Express API)
     |  (reads/writes)
     v
 MongoDB Atlas
```

---

## Future Improvements

### Core Features
- **Video content** — Upload and stream course lectures (integrate AWS S3 or Cloudinary)
- **Payment gateway** — Real payments via Razorpay or Stripe before enrollment
- **Course progress tracking** — Mark lessons as complete, show completion percentage
- **Ratings and reviews** — Students can rate and review courses after purchase

### User Experience
- **Search and filters** — Filter courses by category, price range, or instructor
- **Course categories and tags** — Organise courses by topic (Web Dev, Data Science, etc.)
- **Rich text editor** — Instructors can write detailed course descriptions with formatting
- **Email notifications** — Send confirmation emails on signup, enrollment, and course updates

### Security & Performance
- **Refresh tokens** — Implement token rotation to reduce JWT expiry issues
- **Rate limiting** — Prevent brute-force attacks on auth endpoints
- **Image upload** — Let instructors upload thumbnails directly instead of using URLs
- **Pagination** — Paginate course listing for performance at scale

### Instructor Tools
- **Course analytics** — Show instructors their enrollment counts and revenue
- **Coupon codes** — Instructors can offer discounts on their courses
- **Draft/publish system** — Save courses as drafts before publishing

### Admin Panel
- **Super admin role** — Ability to moderate courses and suspend accounts
- **Platform-level analytics** — Total users, revenue, popular courses

---

