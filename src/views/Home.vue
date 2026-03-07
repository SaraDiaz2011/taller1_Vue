<template>
  <div class="home-container">
    <header class="hero">
      <div class="hero-content">
        <h1>Bienvenido a la mejor experiencia</h1>
        <h2>Disfruta de tus películas favoritas sin límites.</h2>
        <div class="hero-buttons">
          <button class="btn btn-primary">Reproducir</button>
          <button class="btn btn-secondary">Más Información</button>
        </div>
      </div>
      <div class="hero-fadeBottom"></div>
    </header>

    <div class="movies-row">
      <h2>Tendencias</h2>
      
      <div v-if="loading" class="loading">Cargando películas...</div>
      
      <div v-if="error" class="error">{{ error }}</div>

      <div class="movies-posters" v-if="!loading && !error && movies.length > 0">
        <div v-for="movie in movies" :key="movie.id" class="movie-card">
          <img 
            :src="movie.imagen_URL || movie.imagen_url || movie.poster || 'https://raw.githubusercontent.com/SaraDiaz2011/taller1_Vue/main/public/vite.svg'" 
            :alt="movie.titulo" 
            class="movie-poster" 
          />
          <div class="movie-info">
            <h3>{{ movie.titulo }} ({{ movie.añoEstreno }})</h3>
            <p>{{ movie.descripcion?.substring(0, 100) }}...</p>
          </div>
        </div>
      </div>
      <div v-else-if="!loading && movies.length === 0" class="empty">
        <p>No hay películas disponibles en la base de datos.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const movies = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const { data, error: pbError } = await supabase
      .from('Movies')
      .select('*')
      
    if (pbError) throw pbError
    movies.value = data || []
    console.log('Películas cargadas:', data)
  } catch (err) {
    console.error('Error fetching movies:', err)
    error.value = 'Error al cargar películas. Verifica la consola para más detalles.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #141414;
  color: white;
}

.hero {
  height: 80vh;
  position: relative;
  background-image: url('https://image.tmdb.org/t/p/original/t6HIqrHeCPsQ0oFs0QzQoRDEkE4.jpg'); /* placeholder hero */
  background-size: cover;
  background-position: center center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); /* darkened overlay */
}

.hero-content {
  position: relative;
  z-index: 2;
  margin-left: 4rem;
  max-width: 600px;
}

.hero-content h1 {
  font-size: 4rem;
  margin: 0;
  font-weight: 800;
}

.hero-content h2 {
  font-size: 1.5rem;
  font-weight: 400;
  margin-top: 1rem;
}

.hero-buttons {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-weight: bold;
}

.btn-primary {
  background-color: white;
  color: black;
}

.btn-primary:hover {
  background-color: rgba(255, 255, 255, 0.7);
}

.btn-secondary {
  background-color: rgba(109, 109, 110, 0.7);
  color: white;
}

.btn-secondary:hover {
  background-color: rgba(109, 109, 110, 0.4);
}

.hero-fadeBottom {
  position: absolute;
  bottom: 0;
  height: 10rem;
  width: 100%;
  background-image: linear-gradient(
    180deg,
    transparent,
    rgba(37, 37, 37, 0.61),
    #141414
  );
  z-index: 1;
}

.movies-row {
  padding: 2rem 4rem;
  background-color: #141414;
  position: relative;
  z-index: 5;
}

.movies-row h2 {
  margin-bottom: 1rem;
}

.movies-posters {
  display: flex;
  overflow-y: hidden;
  overflow-x: scroll;
  padding: 20px;
  gap: 15px;
}

.movies-posters::-webkit-scrollbar {
  display: none;
}

.movie-card {
  min-width: 200px;
  max-width: 200px;
  transition: transform 450ms;
  background-color: #222;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.movie-card:hover {
  transform: scale(1.08);
  z-index: 10;
}

.movie-poster {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.movie-info {
  padding: 1rem;
}

.movie-info h3 {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
}

.movie-info p {
  font-size: 0.85rem;
  color: #ccc;
  margin: 0;
}

.loading, .error, .empty {
  padding: 2rem 0;
  color: #999;
}

.error {
  color: #e50914;
}
</style>
