<template>
    <div class="register">
      <h1>Registrar-se</h1>
      <div v-if="error" class="error">{{ error }}</div>
      
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="name">Nome</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        
        <div class="form-group">
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirmar Senha</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required />
        </div>
        
        <button type="submit" :disabled="loading">{{ loading ? 'Carregando...' : 'Registrar-se' }}</button>
      </form>
      
      <p>Já possui uma conta? <router-link to="/login">Login</router-link></p>
    </div>
</template>

<script>
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        error: '',
        loading: false
      }
    },
    computed: {
        passwordsMatch() {
            return this.password === this.confirmPassword
        }
    },
    methods: {
      async register() {
        this.loading = true
        this.error = ''
        if (!this.passwordsMatch) {
          this.error = 'As senhas devem ser iguais'
          this.loading = false
          return
        }
        try {
          await createUserWithEmailAndPassword(getAuth(), this.email, this.password)
          this.$router.push('/login')
        } catch (error) {
          this.error = error.message
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>