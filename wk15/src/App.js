import React, { useState, useEffect } from 'react';
import './App.css';


const MOCK_API_URL = ' http://localhost:8000';


// Resource component
function Task({ task, onDelete, onUpdate }) {
  const [isEditing, setEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState(task.text);

  const handleUpdate = () => {
    onUpdate(task.id, updatedTask);
    setEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <>
          <input
            type="text"
            value={updatedTask}
            onChange={(e) => setUpdatedTask(e.target.value)}
          />
          <button onClick={handleUpdate}>Update</button>
        </>
      ) : (
        <>
          <span>{task.text}</span>
          <button onClick={() => onDelete(task.id)}>Delete</button>
          <button onClick={() => setEditing(true)}>Edit</button>
        </>
      )}
    </div>
  );
}

// Main App component
function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    // Fetch tasks from the API on component mount
    fetch(MOCK_API_URL)
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, []);

  const createTask = () => {
    // Create a new task and add it to the API
    fetch(MOCK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: newTask }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks([...tasks, data]);
        setNewTask('');
      });
  };

  const updateTask = (id, text) => {
    // Update a task in the API
    fetch(`${MOCK_API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    }).then(() => {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, text } : task
      );
      setTasks(updatedTasks);
    });
  };

  const deleteTask = (id) => {
    // Delete a task from the API
    fetch(`${MOCK_API_URL}/${id}`, {
      method: 'DELETE',
    }).then(() => {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    });
  };

  return (
    <div className='Task'>
      <h1>Task Manager</h1>
      <input
        type="text"
        placeholder="New Task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={createTask}>Add Task</button>
      <div>
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        ))}
      </div>
    </div>
  );
}

export default App;









