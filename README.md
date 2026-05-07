# Taskr — Simple Todo App

A full-stack Todo application with **Create, Read, Delete** functionality.

- **Frontend**: React.js + Vite
- **Backend**: Express.js (Node.js)
- **Storage**: In-memory (swap for MongoDB/PostgreSQL easily)

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Run locally

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm start

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open http://localhost:5173

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/todos | Get all todos |
| POST | /api/todos | Create a todo `{ text: string }` |
| PATCH | /api/todos/:id | Toggle done |
| DELETE | /api/todos/:id | Delete a todo |

---

## 🌐 Deployment

### Option A — Render (Free, Recommended)

**Backend:**
1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect repo → Root: `backend`
4. Build: `npm install` | Start: `node server.js`

**Frontend:**
1. New Static Site on Render
2. Root: `frontend`
3. Build: `npm install && npm run build`
4. Publish dir: `dist`
5. Set env var: `VITE_API_URL=https://your-backend.onrender.com`

### Option B — Railway

1. Connect GitHub repo
2. Deploy `backend/` as one service
3. Deploy `frontend/` as another (set `VITE_API_URL`)

---

## 🗄️ Adding a Real Database (Optional)

To swap in MongoDB, install mongoose in backend:
```bash
npm install mongoose
```

Then replace the in-memory array in `server.js` with Mongoose models.

---

## 📁 Project Structure

```
todo-app/
├── backend/
│   ├── server.js       # Express API
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx     # Main React component
│   │   ├── main.jsx    # Entry point
│   │   └── index.css   # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```
# AA10
