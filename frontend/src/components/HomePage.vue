<template>
    <div class="home">
      <h1>Bem-vindo ao organizador de Tarefas</h1>
      <p>Uma aplicação genérica para gerenciamento de tarefas.</p>
      
      <div class="actions" v-if="!isAuthenticated">
        <router-link to="/login" class="btn">Login</router-link>
        <router-link to="/register" class="btn">Registrar-se</router-link>
      </div>
      
      <div v-else>
        <router-link to="/tasks" class="btn">Ir para Minhas Tarefas</router-link>
      </div>
      
      <div class="features">
        <h2>Funcionalidades</h2>
        <ul>
          <li>Criar e gerenciar tarefas</li>
          <li>Definir datas de vencimento</li>
          <li>Marcar tarefas como concluidas</li>
          <li>Autenticação de usuário</li>
        </ul>
      </div>
    </div>
</template>

<script>
  import { getAuth } from 'firebase/auth'

  export default {
    computed: {
      isAuthenticated() {
        return getAuth().currentUser
      },
    },
  }
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  margin-bottom: 10px;
}

p {
  margin-bottom: 30px;
  color: #666;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

.features {
  margin-top: 40px;
  text-align: left;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.features ul {
  padding-left: 20px;
}

.features li {
  margin-bottom: 10px;
}
</style>