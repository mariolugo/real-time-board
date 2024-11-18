import express from 'express';
import { createServer } from 'http';
import { dirname } from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const connectedClients = new Map();
const tasks = new Map();
const taskEditors = new Map();
const cursorPositions = new Map();

io.on('connection', (socket) => {
  socket.on('clientData', ({ name, color }) => {
    connectedClients.set(socket.id, { name, color });
    io.emit('clientsUpdate', Array.from(connectedClients.values()));
    socket.emit('initialTasks', Array.from(tasks.values()));
    socket.emit('cursorPositions', Array.from(cursorPositions.entries()));
  });

  socket.on('createTask', (task) => {
    tasks.set(task.id, task);
    io.emit('taskUpdate', Array.from(tasks.values()));
  });

  socket.on('moveTask', ({ taskId, column }) => {
    const task = tasks.get(taskId);
    if (task) {
      task.column = column;
      tasks.set(taskId, task);
      io.emit('taskUpdate', Array.from(tasks.values()));
    }
  });

  socket.on('startEditing', ({ taskId }) => {
    const client = connectedClients.get(socket.id);
    taskEditors.set(taskId, { userId: socket.id, ...client });
    io.emit('editingUpdate', Array.from(taskEditors.entries()));
  });

  socket.on('deleteTask', ({ taskId }) => {
    tasks.delete(taskId);
    taskEditors.delete(taskId);
    io.emit('taskUpdate', Array.from(tasks.values()));
    io.emit('editingUpdate', Array.from(taskEditors.entries()));
  });

  socket.on('updateTaskName', ({ taskId, title }) => {
    const task = tasks.get(taskId);
    console.log('task', taskId);
    if (task) {
      task.title = title;
      tasks.set(taskId, task);
      
      io.emit('taskUpdate', Array.from(tasks.values()));
    }
  });

  socket.on('stopEditing', ({ taskId }) => {
    taskEditors.delete(taskId);
    io.emit('editingUpdate', Array.from(taskEditors.entries()));
  });

  socket.on('cursorMove', ({ x, y }) => {
    const client = connectedClients.get(socket.id);
    if (client) {
      cursorPositions.set(socket.id, { 
        x, 
        y, 
        name: client.name, 
        color: client.color 
      });
      // Broadcast to all clients except the sender
      socket.broadcast.emit('cursorPositions', Array.from(cursorPositions.entries()));
    }
  });

  socket.on('disconnect', () => {
    connectedClients.delete(socket.id);
    // Remove user from any tasks they were editing
    for (const [taskId, editor] of taskEditors.entries()) {
      if (editor.userId === socket.id) {
        taskEditors.delete(taskId);
      }
    }
    io.emit('clientsUpdate', Array.from(connectedClients.values()));
    io.emit('editingUpdate', Array.from(taskEditors.entries()));

    cursorPositions.delete(socket.id);
    io.emit('cursorPositions', Array.from(cursorPositions.entries()));
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});