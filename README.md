# Student Placement Portal

A full-stack MERN portal for student placement management.

## Features
- React + Vite frontend with modern glassmorphism UI
- Express + MongoDB backend with JWT authentication
- Registration and login with password validation
- Protected dashboard with profile modal, notes modal, and logout confirmation
- File upload for profile image and resume
- Responsive design with toast notifications

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment
- Backend uses MongoDB at `MONGO_URI`
- JWT secret is configured by `JWT_SECRET`
