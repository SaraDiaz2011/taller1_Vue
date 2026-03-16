<template>
  <div class="auth-wrapper">
    <div class="auth-background"></div>
    <div class="auth-container">
      <h2>Inicia sesión</h2>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <input type="email" v-model="email" placeholder="Email o número de teléfono" required />
        </div>
        <div class="form-group">
          <input type="password" v-model="password" placeholder="Contraseña" required />
        </div>
        
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? 'Iniciando...' : 'Iniciar sesión' }}
        </button>
        
        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        
        <div class="auth-links">
          <p>¿Primera vez en Netflix? <router-link to="/register">Suscríbete ahora.</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    
    if (error) throw error
    
    router.push('/')
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://image.tmdb.org/t/p/original/8Y43POKhhjrloUMYYpo1Zzgxzpf.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.5;
  z-index: -1;
}

.auth-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.auth-container {
  background-color: rgba(0, 0, 0, 0.75);
  padding: 60px 68px 40px;
  border-radius: 4px;
  width: 100%;
  max-width: 450px;
  box-sizing: border-box;
}

h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 28px;
  margin-top: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group input {
  width: 100%;
  padding: 16px 20px;
  border-radius: 4px;
  border: 0;
  background: #333;
  color: white;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  background: #454545;
}

.btn-block {
  width: 100%;
  padding: 16px;
  margin-top: 24px;
  font-size: 1rem;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-block:hover {
  background-color: #f40612;
}

.btn-block:disabled {
  background-color: #e5091488;
  cursor: not-allowed;
}

.error-msg {
  color: #e87c03;
  font-size: 0.9rem;
  margin-top: 10px;
}

.auth-links {
  margin-top: 50px;
  color: #737373;
}

.auth-links a {
  color: white;
  text-decoration: none;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style>
