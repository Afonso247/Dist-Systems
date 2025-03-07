import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectAuthEmulator, getAuth } from 'firebase/auth'

// Firebase config
const firebaseConfig = {
    apiKey: "demo-key-for-emulator",
    authDomain: "task-manager.firebaseapp.com",
    projectId: "task-manager",
    storageBucket: "task-manager.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Iniciar Firebase
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

// Conectar emuladores
if (import.meta.env.DEV === true) {
    connectAuthEmulator(auth, import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL || 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
}

const app = createApp(App)

app.use(router)
app.mount('#app')
