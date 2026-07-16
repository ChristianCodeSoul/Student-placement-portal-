# Student Placement Portal

A full-stack MERN portal for student placement management (React + Vite frontend, Express + MongoDB backend).

## Features

- Registration and login with JWT authentication
- Profile management (image + resume upload)
- Protected dashboard with job listings and notes
- File uploads saved on the backend and served statically

## Getting Started (local development)

Prerequisites:
- Node.js (v18+ recommended)
- MongoDB instance or use the provided development fallback

1. Clone the repo (if you haven't already):

```bash
git clone https://github.com/ChristianCodeSoul/Student-placement-portal-.git
cd "Student-placement-portal-"
```

2. Backend

```bash
cd backend
npm install
# copy .env.example to .env and set MONGO_URI and JWT_SECRET
cp .env.example .env
npm run dev
```

3. Frontend

```bash
cd ../frontend
npm install
npm run dev
# open http://localhost:5173
```

## Environment

Create a `.env` file in the `backend` folder. Example variables:

```
MONGO_URI=mongodb://localhost:27017/student-placement-portal
JWT_SECRET=your_jwt_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## Notes

- Uploaded files are stored in the backend `uploads/` folder and served at `http://localhost:5000/uploads/<filename>`.
- `.gitignore` excludes `node_modules`, `.env`, and `uploads` to keep the repo clean.

## Contributing

Open an issue or create a pull request — happy to accept fixes and improvements.

## License

MIT

---
_If you want a more detailed README (screenshots, architecture diagram, or deployment steps), tell me what to add and I'll update it._
