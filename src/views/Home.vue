<template>

<div class="home">

  <h1>Películas</h1>

  <div v-if="loading">
    Cargando películas...
  </div>

  <div v-if="error">
    {{ error }}
  </div>

  <!-- BOTÓN AGREGAR -->
  <div v-if="isAuthenticated" class="add-movie">
    <button @click="addNewMovie">
      Agregar película
    </button>
  </div>

  <div class="movies-container">

    <div
      v-for="movie in movies"
      :key="movie.id"
      class="movie-card"
    >

      <img
        :src="movie.imagen || 'https://via.placeholder.com/200x300'"
      />

      <h3>{{ movie.titulo }}</h3>

      <p>
        {{ movie.descripcion }}
      </p>

      <!-- BOTONES SOLO PARA USUARIOS LOGUEADOS -->

      <div v-if="isAuthenticated" class="actions">

        <button @click="editMovie(movie)">
          Editar
        </button>

        <button @click="removeMovie(movie.id)">
          Eliminar
        </button>

      </div>

    </div>

  </div>

</div>

</template>

<script setup>

import { onMounted } from 'vue'
import { useMovies } from '../composables/useMovies'

const {
  movies,
  loading,
  error,
  isAuthenticated,
  fetchMovies,
  addMovie,
  updateMovie,
  deleteMovie
} = useMovies()

onMounted(() => {
  fetchMovies()
})

const addNewMovie = async () => {

  const titulo = prompt("Título de la película")
  const descripcion = prompt("Descripción")

  if (!titulo) return

  await addMovie({
    titulo,
    descripcion
  })

}

const editMovie = async (movie) => {

  const nuevoTitulo = prompt("Nuevo título", movie.titulo)

  if (!nuevoTitulo) return

  await updateMovie(movie.id, {
    titulo: nuevoTitulo
  })

}

const removeMovie = async (id) => {

  if (!confirm("¿Eliminar película?")) return

  await deleteMovie(id)

}

</script>

<style>

.home {
  padding: 40px;
}

.movies-container {
  display: grid;
  grid-template-columns: repeat(auto-fill,200px);
  gap: 20px;
}

.movie-card {
  background: #222;
  padding: 10px;
  border-radius: 10px;
}

.movie-card img {
  width: 100%;
}

.actions {
  margin-top: 10px;
}

button {
  margin-right: 5px;
}

</style>