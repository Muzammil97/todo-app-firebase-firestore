import React from 'react';

function TaskList({ tasks, onDeleteTask, onEditTask }) {
  return (
    <ul className="task-list">
      {tasks.map((task, index) => (
        <li key={task.id} className="task-item">
          <span>{task.task}</span>
          <button onClick={() => onEditTask(index)}>Edit</button>
          <button onClick={() => onDeleteTask(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;