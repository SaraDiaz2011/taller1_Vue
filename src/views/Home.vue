<template>
  <div class="home-wrapper">
    <!-- Componente de Dashboard para usuario Logueados -->
    <PrivateHome v-if="isAuthenticated" />
    
    <!-- Componente de Landing para visitantes -->
    <PublicHome v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

// Importar los componentes separados
import PublicHome from './PublicHome.vue'
import PrivateHome from './PrivateHome.vue'

const isAuthenticated = ref(false)

onMounted(async () => {
  // Suscripción al estado real para que la vista cambie mágicamente sin refrescar la página
  const { data: { session } } = await supabase.auth.getSession()
  isAuthenticated.value = !!session

  supabase.auth.onAuthStateChange((_event, session) => {
    isAuthenticated.value = !!session
  })
})
</script>

<style scoped>
.home-wrapper {
  min-height: 100vh;
  width: 100%;
}
</style>