<template>
  <div class="home-container">
    <header class="hero" v-if="featuredMovie" :style="{ backgroundImage: `url(${featuredMovie.imagen_URL || featuredMovie.imagen_url || featuredMovie.poster || 'https://image.tmdb.org/t/p/original/t6HIqrHeCPsQ0oFs0QzQoRDEkE4.jpg'})` }">
      <div class="hero-content">
        <h1 class="hero-title">{{ featuredMovie.titulo }}</h1>
        <p class="hero-description">{{ featuredMovie.descripcion?.substring(0, 150) }}...</p>
        <div class="hero-buttons">
          <button class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" class="btn-icon"><path d="M8 5v14l11-7z"/></svg>
            Reproducir
          </button>
          <button class="btn btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" class="btn-icon"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Más Información
          </button>
        </div>
      </div>
      <div class="hero-fadeBottom"></div>
    </header>

    <div class="movies-main-content">
      <div v-if="loading" class="loading">Cargando películas...</div>
      <div v-if="error" class="error">{{ error }}</div>

      <template v-if="!loading && !error">
        <!-- Vista de Búsqueda -->
        <div v-if="searchQuery" class="search-results-section">
          <h2>Resultados para "{{ searchQuery }}"</h2>
          <div class="movies-grid" v-if="filteredMovies.length > 0">
            <div v-for="movie in filteredMovies" :key="movie.id" class="movie-card">
              <img 
                :src="movie.imagen_URL || movie.imagen_url || movie.poster || 'https://raw.githubusercontent.com/SaraDiaz2011/taller1_Vue/main/public/vite.svg'" 
                :alt="movie.titulo" 
                class="movie-poster" 
              />
              <div class="movie-card-overlay">
                <h3>{{ movie.titulo }} <span v-if="movie.añoEstreno">({{ movie.añoEstreno }})</span></h3>
                <p>{{ movie.descripcion?.substring(0, 80) }}...</p>
              </div>
            </div>
          </div>
          <div v-else class="empty">
            <p>No se encontraron películas para esa búsqueda.</p>
          </div>
        </div>

        <!-- Vista Categorizada Normal -->
        <div v-else class="categories-section">
          <div v-if="Object.keys(moviesByGenre).length === 0" class="empty">
            <p>No hay películas disponibles en la base de datos.</p>
          </div>
          
          <div v-for="(genreMovies, genre) in filteredCategorizedRows" :key="genre" class="movies-row">
            <h2>{{ genre }}</h2>
            <div class="movies-posters" :class="{ 'row-guest': !isAuthenticated }">
              <div v-for="movie in genreMovies" :key="movie.id" class="movie-card">
                <img 
                  :src="movie.imagen_URL || movie.imagen_url || movie.poster || 'https://raw.githubusercontent.com/SaraDiaz2011/taller1_Vue/main/public/vite.svg'" 
                  :alt="movie.titulo" 
                  class="movie-poster" 
                />
                <div class="movie-card-overlay">
                  <h3>{{ movie.titulo }} <span v-if="movie.añoEstreno">({{ movie.añoEstreno }})</span></h3>
                  <p>{{ movie.descripcion?.substring(0, 80) }}...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { useMovies } from '../composables/useMovies'
import { useSearch } from '../composables/useSearch'

const { movies, loading, error, isAuthenticated, fetchMovies } = useMovies()
const { searchQuery } = useSearch()

const featuredMovie = ref(null)

onMounted(async () => {
  await fetchMovies()
  // Establecer la primera película como la del Hero / Billboard
  if (movies.value && movies.value.length > 0) {
    featuredMovie.value = movies.value[0]
  }
})

// Filtrado de búsquedas
const filteredMovies = computed(() => {
  if (!searchQuery.value) return movies.value
  
  const query = searchQuery.value.toLowerCase()
  return movies.value.filter(movie => 
    movie.titulo && movie.titulo.toLowerCase().includes(query)
  )
})

// Lógica de agrupamiento e invitados
const moviesByGenre = computed(() => {
  const groups = {}
  
  // Omitimos la primera cinta de las filas si se usa para el hero
  let itemsToGroup = movies.value
  if (itemsToGroup.length > 0) {
     itemsToGroup = itemsToGroup.slice(1)
  }

  itemsToGroup.forEach(movie => {
    const genre = movie.genero || 'Otros'
    if (!groups[genre]) {
      groups[genre] = []
    }
    groups[genre].push(movie)
  })
  
  return groups
})

const filteredCategorizedRows = computed(() => {
  let result = {}
  let genres = Object.keys(moviesByGenre.value)
  
  if (!isAuthenticated.value) {
    // Si NO está logueado: Máximo 4 filas
    const allowedGenres = genres.slice(0, 4)
    allowedGenres.forEach(genre => {
      // Y máximo 3 películas por fila
      result[genre] = moviesByGenre.value[genre].slice(0, 3)
    })
  } else {
    // Si SI está logueado, todas las filas con scroll
    result = moviesByGenre.value;
  }

  return result
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #141414;
  color: white;
  overflow-x: hidden;
}

.hero {
  height: 90vh;
  position: relative;
  background-size: cover;
  background-position: center top;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%);
}

.hero-content {
  position: relative;
  z-index: 2;
  margin-left: 4rem;
  max-width: 650px;
  padding-top: 100px;
}

.hero-title {
  font-size: 4.5rem;
  margin: 0;
  font-weight: 800;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.45);
}

.hero-description {
  font-size: 1.25rem;
  font-weight: 400;
  margin-top: 1.2rem;
  line-height: 1.4;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.45);
}

.hero-buttons {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.6rem 1.8rem;
  font-size: 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-icon {
  margin-bottom: 2px;
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
  height: 14rem;
  width: 100%;
  background-image: linear-gradient(
    180deg,
    transparent 0%,
    rgba(20, 20, 20, 0.6) 20%,
    rgba(20, 20, 20, 0.9) 60%,
    #141414 100%
  );
  z-index: 1;
}

.movies-main-content {
  padding-bottom: 2rem;
  background-color: #141414;
  position: relative;
  z-index: 5;
  margin-top: -10rem;
}

.movies-row {
  margin-bottom: 3rem;
  padding-left: 4rem;
}

.movies-row h2 {
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: #e5e5e5;
  cursor: pointer;
  display: inline-block;
  transition: color 0.2s;
}

.movies-row h2:hover {
  color: white;
}

.movies-posters {
  display: flex;
  overflow-y: hidden;
  overflow-x: auto;
  padding: 0px 20px 40px 0; /* extra padding bottom/right for scale hover */
  gap: 8px;
  scroll-behavior: smooth;
}

.movies-posters.row-guest {
  overflow-x: hidden; /* No scroll for guests, static grid */
}

.movies-posters::-webkit-scrollbar {
  height: 0px;
}

.search-results-section {
  padding: 2rem 4rem;
  padding-top: 6rem; /* extra space below navbar */
}

.search-results-section h2 {
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.movies-grid, .movies-posters {
  display: flex;
}

.movies-grid {
  flex-wrap: wrap;
  gap: 20px;
}

/* CARDS AND HOVER OVERLAY SYSTEM */
.movie-card {
  min-width: 240px;
  max-width: 240px;
  height: 135px; /* Wide aspect ratio like netflix lists */
  background-color: #222;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), z-index 0.4s, box-shadow 0.4s;
  will-change: transform;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.movie-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85); /* Dark overlay */
  border-radius: 4px;
  padding: 1rem;
  box-sizing: border-box;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.movie-card:hover {
  transform: scale(1.35) translateY(-5%); /* Enlarge significantly, move slightly up */
  z-index: 100;
  box-shadow: 0 10px 30px rgba(0,0,0,0.9);
}

.movie-card:hover .movie-card-overlay {
  opacity: 1; /* Show info when enlarged */
}

.movie-card-overlay h3 {
  font-size: 0.95rem;
  margin: 0 0 0.4rem 0;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-card-overlay p {
  font-size: 0.65rem;
  color: #ccc;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.loading, .error, .empty {
  padding: 2rem 4rem;
  color: #999;
}

.error {
  color: #e50914;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
  .movie-card {
    min-width: 180px;
    height: 100px;
  }
  .movies-row {
    padding-left: 2rem;
  }
  .hero-content {
    margin-left: 2rem;
  }
}
</style>
