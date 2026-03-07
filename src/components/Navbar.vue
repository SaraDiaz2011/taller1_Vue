<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <router-link to="/">NETFLIX-CLONE</router-link>
    </div>
    <div class="navbar-links">
      <template v-if="!user">
        <router-link to="/login" class="nav-btn">Iniciar Sesión</router-link>
        <router-link to="/register" class="nav-btn btn-primary">Registrarse</router-link>
      </template>
      <template v-else>
        <button @click="logout" class="nav-btn">Cerrar Sesión</button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const user = ref(null)
const router = useRouter()

onMounted(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    user.value = session?.user || null
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
  })
})

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 4rem;
  background-color: transparent;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 100;
  box-sizing: border-box;
}

.navbar-logo a {
  color: #e50914;
  font-size: 2rem;
  font-weight: bold;
  text-decoration: none;
}

.navbar-links {
  display: flex;
  gap: 1rem;
}

.nav-btn {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.3s;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-primary {
  background-color: #e50914;
}

.btn-primary:hover {
  background-color: #f40612;
}
</style>
