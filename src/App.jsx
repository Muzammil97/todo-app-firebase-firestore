// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import TaskInput from './components/TaskInput.jsx';
import TaskList from './components/TaskList.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { AuthProvider, useAuth } from './context/AuthContext';
import { db } from './firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import './styles/style.css';

function AppContent() {
  const [tasks, setTasks] = useState([]);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editingTaskValue, setEditingTaskValue] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    } else {
      setTasks([]); // Clear tasks when logged out
    }
  }, [currentUser]);

  const fetchTasks = async () => {
    try {
      const tasksCollection = collection(db, "users", currentUser.uid, "tasks");
      const querySnapshot = await getDocs(tasksCollection);
      const taskList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(taskList);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async (task) => {
    try {
      const tasksCollection = collection(db, "users", currentUser.uid, "tasks");
      await addDoc(tasksCollection, { task: task });
      fetchTasks(); // Refresh task list
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const taskDoc = doc(db, "users", currentUser.uid, "tasks", id);
      await deleteDoc(taskDoc);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEditingTask = (index) => {
    setEditingTaskIndex(index);
    setEditingTaskValue(tasks[index].task);
  };

  const updateTask = async () => {
    try {
      const taskDoc = doc(db, "users", currentUser.uid, "tasks", tasks[editingTaskIndex].id);
      await updateDoc(taskDoc, { task: editingTaskValue });
      fetchTasks();
      setEditingTaskIndex(null);
      setEditingTaskValue('');
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await useAuth().logout();
      // Optionally redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  return (
    <div className="app-container">
      <Header onLogout={handleLogout} />
      <TaskInput onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onDeleteTask={handleDeleteTask}
        onEditTask={startEditingTask}
      />
      {editingTaskIndex !== null && (
        <div className="edit-task">
          <input
            type="text"
            value={editingTaskValue}
            onChange={(e) => setEditingTaskValue(e.target.value)}
          />
          <button onClick={updateTask}>Update Task</button>
        </div>
      )}
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppContent />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;