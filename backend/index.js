const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const admin = require('firebase-admin');

dotenv.config();

// Iniciar Express
const app = express();
const port = process.env.PORT || 3000;

// Iniciar Firebase Admin
admin.initializeApp({
  projectId: 'task-manager',
  credential: process.env.NODE_ENV === 'development' 
    ? admin.credential.applicationDefault() 
    : admin.credential.cert(require('./service-account.json')), // Para produção
});

// Conectar emuladores
if (process.env.NODE_ENV === 'development') {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';
  process.env.FIREBASE_FIRESTORE_EMULATOR_HOST = process.env.FIREBASE_FIRESTORE_EMULATOR_HOST || 'localhost:8080';
}

const db = admin.firestore();
const auth = admin.auth();

if (process.env.NODE_ENV === 'development') {
  const db = admin.firestore();
  db.settings({
    host: 'firebase-emulator:8080', // Nome do serviço no Docker Compose
    ssl: false
  });
}

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Middleware de autenticação
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Rotas
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running' });
});

// Obter todas as tarefas do usuário
app.get('/api/tasks', authenticate, async (req, res) => {
  try {
    const userId = req.user.uid;
    const tasksSnapshot = await db.collection('tasks')
      .where('userId', '==', userId)
      .get();
    
    const tasks = [];
    tasksSnapshot.forEach(doc => {
      tasks.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Criar uma nova tarefa
app.post('/api/tasks', authenticate, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { title, description, dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const taskData = {
      userId,
      title,
      description: description || '',
      dueDate: dueDate || null,
      completed: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const taskRef = await db.collection('tasks').add(taskData);
    res.status(201).json({
      id: taskRef.id,
      ...taskData
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Atualizar uma tarefa
app.put('/api/tasks/:id', authenticate, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.uid;
    const updates = req.body;
    
    // Verify task ownership
    const taskDoc = await db.collection('tasks').doc(taskId).get();
    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (taskDoc.data().userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized: You do not own this task' });
    }
    
    await db.collection('tasks').doc(taskId).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ id: taskId, ...updates });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Remover uma tarefa
app.delete('/api/tasks/:id', authenticate, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.uid;
    
    // Verificar se a tarefa pertence ao usuário
    const taskDoc = await db.collection('tasks').doc(taskId).get();
    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (taskDoc.data().userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized: You do not own this task' });
    }
    
    await db.collection('tasks').doc(taskId).delete();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});