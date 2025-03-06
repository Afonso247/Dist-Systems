<template>
    <div class="main-container">
      <Login />
    </div>
  </template>
  
  <script>
  import Login from '../components/LoginPage.vue'
  
  export default {
    name: 'LoginView',
    components: {
      Login,
    },
  }
  </script>
  
  <style scoped></style>