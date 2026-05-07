import { useState, useEffect } from "react";

const API = "/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  // READ
  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((data) => { setTodos(data); setLoading(false); })
      .catch(() => { setError("Failed to load todos."); setLoading(false); });
  }, []);

  // CREATE
  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim() || adding) return;
    setAdding(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.trim() }),
      });
      const newTodo = await res.json();
      setTodos((prev) => [newTodo, ...prev]);
      setInput("");
    } catch {
      setError("Failed to add todo.");
    } finally {
      setAdding(false);
    }
  };

  // TOGGLE
  const toggleTodo = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: "PATCH" });
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError("Failed to update.");
    }
  };

  // DELETE
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete.");
    }
  };

  const done = todos.filter((t) => t.done).length;
  const total = todos.length;

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>TASKR</h1>
          <p style={styles.sub}>Simple. Fast. Done.</p>
        </div>
        {total > 0 && (
          <div style={styles.badge}>
            <span style={styles.badgeNum}>{done}</span>
            <span style={styles.badgeSep}>/</span>
            <span style={styles.badgeTotal}>{total}</span>
          </div>
        )}
      </header>

      {/* Add form */}
      <form onSubmit={addTodo} style={styles.form}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="what needs to be done?"
          maxLength={120}
          disabled={adding}
          autoFocus
        />
        <button type="submit" style={styles.addBtn} disabled={adding || !input.trim()}>
          {adding ? "..." : "+ ADD"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div style={styles.error} onClick={() => setError(null)}>
          ⚠ {error} <span style={{ opacity: 0.5 }}>(click to dismiss)</span>
        </div>
      )}

      {/* List */}
      <div style={styles.list}>
        {loading && <p style={styles.empty}>Loading...</p>}
        {!loading && todos.length === 0 && (
          <p style={styles.empty}>No tasks yet. Add one above ↑</p>
        )}
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>

      {/* Footer */}
      {total > 0 && (
        <footer style={styles.footer}>
          {total - done} remaining · {done} completed
        </footer>
      )}
    </div>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.item,
        background: hovered ? "#1f1f1f" : "#181818",
        opacity: todo.done ? 0.55 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        style={{
          ...styles.check,
          background: todo.done ? "var(--accent)" : "transparent",
          borderColor: todo.done ? "var(--accent)" : "#444",
        }}
        title="Toggle done"
      >
        {todo.done && <span style={styles.checkmark}>✓</span>}
      </button>

      {/* Text */}
      <span
        style={{
          ...styles.todoText,
          textDecoration: todo.done ? "line-through" : "none",
          color: todo.done ? "var(--muted)" : "var(--text)",
        }}
      >
        {todo.text}
      </span>

      {/* Delete */}
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          ...styles.deleteBtn,
          opacity: hovered ? 1 : 0,
        }}
        title="Delete"
      >
        ✕
      </button>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 640,
    margin: "0 auto",
    padding: "60px 24px 40px",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 48,
    fontWeight: 800,
    color: "var(--accent)",
    letterSpacing: "-1px",
    lineHeight: 1,
  },
  sub: {
    fontSize: 12,
    color: "var(--muted)",
    marginTop: 4,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  badge: {
    display: "flex",
    alignItems: "baseline",
    gap: 4,
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
  },
  badgeNum: { fontSize: 32, color: "var(--accent)" },
  badgeSep: { fontSize: 20, color: "var(--muted)" },
  badgeTotal: { fontSize: 20, color: "var(--muted)" },
  form: {
    display: "flex",
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text)",
    fontSize: 14,
    padding: "12px 16px",
    transition: "border-color 0.15s",
  },
  addBtn: {
    background: "var(--accent)",
    color: "#0e0e0e",
    fontSize: 13,
    fontWeight: 500,
    padding: "12px 20px",
    borderRadius: "var(--radius)",
    letterSpacing: "0.05em",
    transition: "background 0.15s, opacity 0.15s",
    whiteSpace: "nowrap",
  },
  error: {
    background: "#2a1111",
    border: "1px solid var(--danger)",
    color: "var(--danger)",
    padding: "10px 14px",
    borderRadius: "var(--radius)",
    fontSize: 13,
    marginBottom: 12,
    cursor: "pointer",
  },
  list: {
    marginTop: 16,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  empty: {
    color: "var(--muted)",
    fontSize: 14,
    textAlign: "center",
    padding: "40px 0",
    letterSpacing: "0.05em",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 16px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    transition: "background 0.15s",
  },
  check: {
    width: 22,
    height: 22,
    flexShrink: 0,
    borderRadius: "var(--radius)",
    border: "1.5px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s, border-color 0.15s",
  },
  checkmark: {
    fontSize: 13,
    color: "#0e0e0e",
    fontWeight: 700,
  },
  todoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 1.5,
    wordBreak: "break-word",
    transition: "color 0.2s",
  },
  deleteBtn: {
    background: "transparent",
    color: "var(--danger)",
    fontSize: 14,
    padding: "4px 6px",
    flexShrink: 0,
    transition: "opacity 0.15s",
    borderRadius: "var(--radius)",
  },
  footer: {
    marginTop: 32,
    color: "var(--muted)",
    fontSize: 12,
    textAlign: "center",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
};
