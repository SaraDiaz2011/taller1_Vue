<template>
  <div class="private-home">
    <div class="dashboard-header">
      <h2>Catálogo de Películas</h2>
      <button class="btn-primary" @click="openAddModal">
        + Añadir Película
      </button>
    </div>

    <!-- Carga y Errores -->
    <div v-if="loading" class="loading">Cargando catálogo...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Catálogo Categorizado -->
    <div v-if="!loading && !error" class="dashboard-content">
      <div v-if="Object.keys(moviesByGenre).length === 0" class="empty">
        <p>No tienes películas. ¡Agrega la primera!</p>
      </div>

      <div 
        v-for="(genreMovies, genre) in moviesByGenre" 
        :key="genre" 
        class="category-section"
      >
        <h3 class="category-title">{{ genre }}</h3>
        
        <div class="movies-grid">
          <div 
            v-for="movie in genreMovies" 
            :key="movie.id" 
            class="movie-card"
          >
            <img 
              :src="movie.imagen_URL || movie.imagen_url || movie.poster || 'https://raw.githubusercontent.com/SaraDiaz2011/taller1_Vue/main/public/vite.svg'" 
              :alt="movie.titulo" 
              class="movie-poster" 
            />
            
            <div class="movie-card-overlay">
              <h4 class="movie-title">{{ movie.titulo }}</h4>
              <div class="card-actions">
                <button class="action-btn edit-btn" @click="openEditModal(movie)">
                  Editar
                </button>
                <button class="action-btn delete-btn" @click="confirmDelete(movie.id)">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Integrado -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Editar Película' : 'Nueva Película' }}</h3>
        
        <form @submit.prevent="saveMovie" class="movie-form">
          <div class="form-group">
            <label>Título *</label>
            <input type="text" v-model="formData.titulo" required />
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="formData.descripcion" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>Categoría / Género</label>
            <input type="text" v-model="formData.genero" placeholder="Ej: Acción, Drama" />
          </div>

          <div class="form-group">
            <label>Año de Estreno</label>
            <input type="number" v-model="formData.añoEstreno" />
          </div>

          <div class="form-group">
            <label>URL de Imagen</label>
            <input type="url" v-model="formData.imagen_URL" placeholder="https://..." />
          </div>
          
          <div v-if="formError" class="form-error">{{ formError }}</div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeModal" :disabled="isSaving">Cancelar</button>
            <button type="submit" class="btn-save" :disabled="isSaving">
              {{ isSaving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMovies } from '../composables/useMovies'

const { movies, loading, error, fetchMovies, addMovie, updateMovie, deleteMovie } = useMovies()

// Estado del Modal
const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const formError = ref('')

// Datos del formulario
const initialFormState = {
  id: null,
  titulo: '',
  descripcion: '',
  genero: '',
  añoEstreno: null,
  imagen_URL: ''
}
const formData = ref({ ...initialFormState })

onMounted(async () => {
  await fetchMovies()
})

// Computada para agrupar por género
const moviesByGenre = computed(() => {
  const groups = {}
  
  if (!movies.value) return groups

  movies.value.forEach(movie => {
    const genre = movie.genero || 'Otros'
    if (!groups[genre]) {
      groups[genre] = []
    }
    groups[genre].push(movie)
  })
  
  return groups
})

// Acciones del UI
const openAddModal = () => {
  isEditing.value = false
  formData.value = { ...initialFormState }
  formError.value = ''
  isModalOpen.value = true
}

const openEditModal = (movie) => {
  isEditing.value = true
  formData.value = {
    id: movie.id,
    titulo: movie.titulo || '',
    descripcion: movie.descripcion || '',
    genero: movie.genero || '',
    añoEstreno: movie.añoEstreno || null,
    imagen_URL: movie.imagen_URL || movie.imagen_url || movie.poster || ''
  }
  formError.value = ''
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// Interacciones con base de datos
const saveMovie = async () => {
  try {
    isSaving.value = true
    formError.value = ''

    if (!formData.value.titulo) {
       formError.value = 'El título es obligatorio.'
       return
    }

    const payload = {
      titulo: formData.value.titulo,
      descripcion: formData.value.descripcion,
      genero: formData.value.genero,
      añoEstreno: formData.value.añoEstreno,
      imagen_URL: formData.value.imagen_URL
    }

    if (isEditing.value) {
      await updateMovie(formData.value.id, payload)
    } else {
      await addMovie(payload)
    }
    
    closeModal()
  } catch (err) {
    formError.value = 'Error al guardar la película. Inténtalo de nuevo.'
    console.error(err)
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta película? Esta acción no se puede deshacer.')) {
    try {
      await deleteMovie(id)
    } catch (err) {
      console.error('Error al borrar', err)
      alert('Error al intentar eliminar la película.')
    }
  }
}
</script>

<style scoped>
.private-home {
  padding: 100px 4rem 4rem 4rem; /* Padding top for fixed navbar */
  min-height: 100vh;
  background-color: #141414;
  color: white;
  box-sizing: border-box;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  border-bottom: 1px solid #333;
  padding-bottom: 1rem;
}

.dashboard-header h2 {
  font-size: 2rem;
  margin: 0;
}

.btn-primary {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #f40612;
}

.category-section {
  margin-bottom: 3rem;
}

.category-title {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: #e5e5e5;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.movie-card {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background-color: #222;
  aspect-ratio: 16 / 9; /* Formato apaisado */
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
}

.movie-card-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  padding: 1rem;
  text-align: center;
}

.movie-card:hover .movie-card-overlay {
  opacity: 1;
}

.movie-card:hover .movie-poster {
  opacity: 0.3;
}

.movie-title {
  font-size: 1rem;
  margin: 0 0 1rem 0;
  font-weight: bold;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
}

.edit-btn { background: #333; color: white; }
.edit-btn:hover { background: #555; }
.delete-btn { background: rgba(229, 9, 20, 0.8); color: white; }
.delete-btn:hover { background: #e50914; }

/* Modal Estilos */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: #1a1a1a;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  border: 1px solid #333;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  border-bottom: 1px solid #333;
  padding-bottom: 15px;
}

.movie-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 0.9rem;
  color: #ccc;
}

.form-group input,
.form-group textarea {
  background-color: #333;
  border: 1px solid #444;
  color: white;
  padding: 10px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #e50914;
}

.form-error {
  color: #e50914;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.btn-cancel {
  background: transparent;
  color: white;
  border: 1px solid #555;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel:hover {
  background: #333;
}

.btn-save {
  background: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.btn-save:hover {
  background: #f40612;
}

.btn-save:disabled {
  background: #a00;
  cursor: not-allowed;
}

.loading, .error, .empty {
  padding: 2rem 0;
  color: #999;
  font-size: 1.1rem;
}

</style>
