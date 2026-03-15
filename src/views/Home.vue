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
        :src="movie.imagen_URL || 'https://via.placeholder.com/200x300'"
        alt="poster"
      />

      <h3>{{ movie.titulo }}</h3>

      <p>
        {{ movie.descripcion }}
      </p>

      <small>
        {{ movie.genero }} - {{ movie.añoEstreno }}
      </small>

      <!-- BOTONES SOLO SI ESTÁ AUTENTICADO -->

      <div
        v-if="isAuthenticated"
        class="actions"
      >

        <button
          @click="editMovie(movie)"
        >
          Editar
        </button>

        <button
          @click="removeMovie(movie.id)"
        >
          Eliminar
        </button>

      </div>

    </div>

  </div>

</div>

</template>

<script setup>

import { onMounted } from "vue"
import { useMovies } from "../composables/useMovies"

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
  const genero = prompt("Género")
  const añoEstreno = prompt("Año de estreno")
  const imagen = prompt("URL de la imagen")

  if (!titulo) return

  await addMovie({

    titulo,
    descripcion,
    genero,
    añoEstreno,
    imagen_URL: imagen

  })

}

const editMovie = async (movie) => {

  const nuevoTitulo = prompt(
    "Nuevo título",
    movie.titulo
  )

  const nuevaDescripcion = prompt(
    "Nueva descripción",
    movie.descripcion
  )

  if (!nuevoTitulo) return

  await updateMovie(

    movie.id,
    {

      titulo: nuevoTitulo,
      descripcion: nuevaDescripcion

    }

  )

}

const removeMovie = async (id) => {

  if (!confirm("¿Eliminar película?")) return

  await deleteMovie(id)

}

</script>

<style>

.home{
  padding:40px;
}

.movies-container{

  display:grid;
  grid-template-columns:repeat(auto-fill,200px);
  gap:20px;

}

.movie-card{

  background:#1c1c1c;
  padding:10px;
  border-radius:10px;
  color:white;

}

.movie-card img{

  width:100%;
  border-radius:6px;

}

.actions{

  margin-top:10px;

}

button{

  margin-right:5px;
  padding:5px 8px;
  cursor:pointer;

}

</style>