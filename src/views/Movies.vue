<template>
  <div class="movies-page">
    <Navbar />
    <div class="movies-container">
      <h1>Películas</h1>
      <div v-if="loading">Cargando...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <div v-for="category in categories" :key="category" class="category-section">
          <h2>{{ category }}</h2>
          <div class="movies-grid">
            <div v-for="movie in getMoviesByCategory(category)" :key="movie.id" class="movie-card">
              <img :src="movie.poster" :alt="movie.titulo" />
              <h3>{{ movie.titulo }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMovies } from '../composables/useMovies'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

const { movies, loading, error, fetchMovies } = useMovies()

onMounted(() => {
  fetchMovies()
})

// Obtener categorías únicas de las películas
const categories = computed(() => {
  const cats = new Set(movies.value.map(movie => movie.categoria).filter(cat => cat))
  return Array.from(cats)
})

const getMoviesByCategory = (category) => {
  return movies.value.filter(movie => movie.categoria === category)
}
</script>

<style scoped>
.movies-page {
  min-height: 100vh;
  background-color: #141414;
  color: white;
}

.movies-container {
  padding: 20px;
}

.category-section {
  margin-bottom: 40px;
}

.category-section h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.movie-card {
  background-color: #333;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.movie-card h3 {
  padding: 10px;
  font-size: 16px;
}
</style>