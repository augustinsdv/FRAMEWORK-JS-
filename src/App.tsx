import React, { useState, useEffect } from "react";
import "./index.css";


type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const deleteTask = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  
  const doneCount = tasks.filter((t) => t.done).length;
  const todoCount = tasks.length - doneCount;

  return (
    <div className="todoapp">
      <h1>Mes tâches</h1>
      <Form onAddTask={addTask} />

      
    <p className="counter">
      <span className="todo">{todoCount} à faire</span> /{" "}
      <span className="done">{doneCount} faites</span>
    </p>


      <TaskList
        tasks={tasks}
        onDeleteTask={deleteTask}
        onToggleTask={toggleTask}
      />
    </div>
  );
}

type FormProps = {
  onAddTask: (task: Task) => void;
};

function Form({ onAddTask }: FormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.length < 3) {
      alert("Le titre doit contenir au moins 3 caractères");
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      dueDate: dueDate || undefined,
      done: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddTask(newTask);

    // reset form
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginLeft: "1rem" }}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ marginLeft: "1rem" }}
      />
      <button type="submit" style={{ marginLeft: "1rem" }}>
        Créer la tâche
      </button>
    </form>
  );
}

type TaskListProps = {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
};

function TaskList({ tasks, onDeleteTask, onToggleTask }: TaskListProps) {
  if (tasks.length === 0) {
    return <p>Aucune tâche pour le moment.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} style={{ marginBottom: "0.5rem" }}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => onToggleTask(task.id)}
            style={{
              accentColor: task.done ? "green" : "red", // ✅ couleur dynamique
            }}
          />
          <span className={task.done ? "done" : "todo"}>  <strong>{task.title}</strong> </span>

          {" — "}
          {task.description || "Pas de description"}
          {task.dueDate && (
            <span style={{ marginLeft: "1rem", color: "gray" }}>
               {task.dueDate}
            </span>
          )}
          <button
            onClick={() => onDeleteTask(task.id)}
            style={{ marginLeft: "2rem" }}
          >
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  );
}

export default App;
