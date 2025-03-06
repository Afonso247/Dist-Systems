<template>
    <div class="tasks">
      <h1>Minhas Tarefas</h1>
      
      <div class="create-task">
        <h2>Adicionar Nova Tarefa</h2>
        <form @submit.prevent="createTask">
          <div class="form-group">
            <label for="title">Título</label>
            <input type="text" id="title" v-model="newTask.title" required />
          </div>
          
          <div class="form-group">
            <label for="description">Descrição</label>
            <textarea id="description" v-model="newTask.description"></textarea>
          </div>
          
          <div class="form-group">
            <label for="dueDate">Data de Vencimento</label>
            <input type="date" id="dueDate" v-model="newTask.dueDate" />
          </div>
          
          <button type="submit" :disabled="loading">Adicionar Tarefa</button>
        </form>
      </div>
      
      <div class="task-list">
        <h2>Suas Tarefas</h2>
        <div v-if="loading" class="loading">Carregando tarefas...</div>
        <div v-else-if="tasks.length === 0" class="empty">Sem tarefas cadastradas...</div>
        
        <div v-else class="tasks-container">
          <div v-for="task in tasks" :key="task.id" class="task-card">
            <div class="task-header">
              <h3>{{ task.title }}</h3>
              <div class="task-actions">
                <button @click="toggleComplete(task)" :class="{ 'completed': task.completed }">
                  {{ task.completed ? 'Completed' : 'Mark Complete' }}
                </button>
                <button @click="deleteTask(task.id)" class="delete">Remover</button>
              </div>
            </div>
            
            <div class="task-body">
              <p v-if="task.description">{{ task.description }}</p>
              <p v-if="task.dueDate" class="due-date">
                Vence em: {{ new Date(task.dueDate).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import { getAuth } from 'firebase/auth'
  import axios from 'axios';

  export default {
    data() {
      return {
        tasks: [],
        newTask: {
          title: '',
          description: '',
          dueDate: '',
        },
        loading: false,
      }
    },
    methods: {
      async fetchTasks() {
        this.loading = true
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_URL}/tasks`, {
            headers: {
              Authorization: `Bearer ${getAuth().currentUser.accessToken}`
            }
          })
          this.tasks = response.data
        } catch (error) {
          console.error('Error fetching tasks:', error)
        } finally {
          this.loading = false
        }
      },
      async createTask() {
        try {
          await axios.post(`${process.env.VUE_APP_API_URL}/tasks`, this.newTask, {
            headers: {
              Authorization: `Bearer ${getAuth().currentUser.accessToken}`
            }
          })
          this.newTask.title = ''
          this.newTask.description = ''
          this.newTask.dueDate = ''
          this.fetchTasks()
        } catch (error) {
          console.error('Error creating task:', error)
        }
      },
      async deleteTask(taskId) {
        try {
          await axios.delete(`${process.env.VUE_APP_API_URL}/tasks/${taskId}`, {
            headers: {
              Authorization: `Bearer ${getAuth().currentUser.accessToken}`
            }
          })
          this.fetchTasks()
        } catch (error) {
          console.error('Error deleting task:', error)
        }
      },
      async toggleComplete(task) {
        try {
          await axios.put(`${process.env.VUE_APP_API_URL}/tasks/${task.id}`, {
            completed: !task.completed
          }, {
            headers: {
              Authorization: `Bearer ${getAuth().currentUser.accessToken}`
            }
          })
          this.fetchTasks()
        } catch (error) {
          console.error('Error toggling task completion:', error)
        }
      }
    },
    mounted() {
      this.fetchTasks()
    }
  }
</script>

<style scoped>
.tasks {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.create-task, .task-list {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  height: 80px;
}

button {
  padding: 8px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #a0cfbb;
  cursor: not-allowed;
}

.task-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-header h3 {
  margin: 0;
}

.task-actions {
  display: flex;
  gap: 10px;
}

button.completed {
  background-color: #4caf50;
}

button.delete {
  background-color: #f44336;
}

.task-body {
  text-align: left;
}

.due-date {
  color: #666;
  font-style: italic;
}

.loading, .empty {
  text-align: center;
  margin: 20px 0;
  color: #666;
}
</style>