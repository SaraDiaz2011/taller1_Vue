<template>
  <div id="app-root">
    <Navbar />
    <router-view></router-view>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

<style>
/* Estilos globales básicos que complementan style.css */
#app-root {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

html, body {
  margin: 0;
  padding: 0;
  background-color: #141414;
  color: white;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  overflow-x: hidden;
}
</style>
