<template>

<div class="landing">

  <div class="hero">

    <div class="hero-content">

      <h1>Películas, series y más</h1>

      <h2>
        Disfruta donde quieras. Cancela cuando quieras.
      </h2>

      <p>
        ¿Ya estás suscrito?
      </p>

      <div class="hero-buttons">

        <router-link
          to="/register"
          class="btn-primary"
        >
          Comenzar
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
</script>

<style>

.landing{
height:100vh;
background:black;
color:white;
}

.hero{
height:100%;
display:flex;
align-items:center;
justify-content:center;

background-image:
linear-gradient(
rgba(0,0,0,0.7),
rgba(0,0,0,0.9)
),
url("https://assets.nflxext.com/ffe/siteui/vlv3/9e9ab898-22c4-4bde-b0d2-06f3b9fc5fbd/8d9f0c45-9a7c-4f46-94f6-6e3f8a3a9f4b/CO-es-20240226-popsignuptwoweeks-perspective_alpha_website_medium.jpg");

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
font-size:24px;
margin-bottom:20px;
}

.hero p{
font-size:18px;
margin-bottom:30px;
}

.hero-buttons{
display:flex;
justify-content:center;
gap:20px;
}

.btn-primary{
background:#e50914;
padding:12px 25px;
border-radius:4px;
color:white;
text-decoration:none;
font-weight:bold;
}

.btn-secondary{
background:#333;
padding:12px 25px;
border-radius:4px;
color:white;
text-decoration:none;
}

</style>