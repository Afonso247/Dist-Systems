<template>
    <div class="login">
      <h1>Login</h1>
      <div v-if="error" class="error">{{ error }}</div>
      
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        
        <div class="form-group">
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        
        <button type="submit" :disabled="loading">{{ loading ? 'Carregando...' : 'Login' }}</button>
      </form>
      
      <p>Não tem uma conta? <router-link to="/register">Registre-se</router-link></p>
    </div>
</template>

<script>
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

  export default {
    data() {
      return {
        email: '',
        password: '',
        error: '',
        loading: false
      }
    },
    methods: {
      async login() {
        this.loading = true
        this.error = ''
        await signInWithEmailAndPassword(getAuth(), this.email, this.password)
          .then(() => {
            this.$router.push('/tasks')
          })
          .catch(error => {
            this.error = error.message
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
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

.error {
  color: red;
  margin-bottom: 15px;
}
</style>