<template>
    <div class="main-container">
      <Tasks />
    </div>
  </template>
  
  <script>
  import Tasks from '../components/TasksPage.vue'
  
  export default {
    name: 'TasksView',
    components: {
      Tasks,
    },
  }
  </script>
  
  <style scoped></style>