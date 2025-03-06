<template>
  <div id="app">
    <header class="header">
      <nav class="nav">
        <router-link to="/" class="nav-link">Home</router-link> |
        <router-link to="/tasks" v-if="isAuthenticated" class="nav-link">Tasks</router-link> |
        <router-link to="/login" v-if="!isAuthenticated" class="nav-link">Login</router-link>
        <a href="#" @click="logout" v-if="isAuthenticated" class="nav-link">Logout</a>
      </nav>
    </header>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import { RouterLink, RouterView } from 'vue-router'
  import { getAuth, signOut } from 'firebase/auth'
  import { useAuthState } from '@/composables/useAuth'
  import { useStore } from 'vuex'

  const store = useStore()
  const auth = getAuth()

  // Composables para reutilização de lógica
  const { isAuthenticated } = useAuthState()

  // Estado local para loading
  const isLoading = ref(true)

  // Gerenciamento de estado de autenticação
  onMounted(async () => {
    try {
      await store.dispatch('initAuth')
    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      isLoading.value = false
    }
  })

  // Logout com tratamento melhorado de erros
  const logout = async () => {
    try {
      await signOut(auth)
      this.$router.push('/login')
      store.commit('SHOW_TOAST', {
        message: 'Logged out successfully',
        type: 'success'
      })
    } catch (error) {
      console.error('Logout error:', error)
      store.commit('SHOW_TOAST', {
        message: 'Error logging out. Please try again.',
        type: 'error'
      })
    }
  }

</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
