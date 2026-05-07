const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory store
let todos = [
  { id: 1, text: "Build something awesome", done: false, createdAt: new Date().toISOString() },
];
let nextId = 2;

// GET /api/todos — Read all
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// POST /api/todos — Create
app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text is required" });
  }
  const todo = {
    id: nextId++,
    text: text.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };
  todos.unshift(todo);
  res.status(201).json(todo);
});

// PATCH /api/todos/:id — Toggle done
app.patch("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ error: "Not found" });
  todo.done = !todo.done;
  res.json(todo);
});

// DELETE /api/todos/:id — Delete
app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Not found" });
  todos.splice(index, 1);
  res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
