<template>

<div class="landing">

  <div class="hero">

    <div class="hero-content">

      <h1>Bienvenido a tu catálogo de películas</h1>

      <h2>
        Administra tu colección de películas fácilmente
      </h2>

      <p>
        Podrás agregar, editar y eliminar películas a tu gusto.
      </p>

      <div class="hero-buttons">

        <router-link
          to="/register"
          class="btn-primary"
        >
          Registrarse
        </router-link>

        <router-link
          to="/login"
          class="btn-secondary"
        >
          Iniciar sesión
        </router-link>

      </div>

    </div>

  </div>

</div>

</template>

<script setup>

import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../supabase"

const router = useRouter()

onMounted(async () => {

  const { data:{ session } } =
  await supabase.auth.getSession()

  if(session){

    router.push("/peliculas")

  }

})

</script>

<style>

.landing{
height:100vh;
color:white;
}

/* HERO */

.hero{

height:100%;
display:flex;
align-items:center;
justify-content:center;

background-image:
linear-gradient(
rgba(0,0,0,0.75),
rgba(0,0,0,0.95)
),
url("https://image.tmdb.org/t/p/original/9yBVqNruk6Ykrwc32qrK2TIE5xw.jpg");

background-size:cover;
background-position:center;

}

.hero-content{
text-align:center;
max-width:700px;
}

.hero h1{
font-size:56px;
margin-bottom:20px;
}

.hero h2{
font-size:26px;
margin-bottom:20px;
font-weight:normal;
}

.hero p{
font-size:18px;
margin-bottom:20px;
}

.hero-buttons{
display:flex;
justify-content:center;
gap:20px;
margin-top:20px;
}

.btn-primary{
background:#e50914;
padding:12px 28px;
border-radius:4px;
color:white;
text-decoration:none;
font-weight:bold;
}

.btn-secondary{
background:#333;
padding:12px 28px;
border-radius:4px;
color:white;
text-decoration:none;
}

</style>