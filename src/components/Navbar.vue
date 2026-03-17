<template>
  <nav :class="['navbar', { 'navbar-scrolled': isScrolled }]">
    <div class="navbar-left">
    <div class="navbar-logo">
      <router-link :to="user ? '/peliculas' : '/'">NETFLIX</router-link>
    </div>

    <ul class="navbar-links-list">
      <li><router-link to="/">Inicio</router-link></li>
      <li><router-link to="/peliculas">Películas</router-link></li>
      <li><router-link to="/mi-lista">Mi lista</router-link></li>
    </ul>
    </div>

    <div class="navbar-right">
      <div class="search-box" :class="{ 'search-active': searchActive }" ref="searchContainer">
        <button class="search-icon-btn" @click="toggleSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <input 
          type="text" 
          ref="searchInput"
          v-model="searchQuery" 
          placeholder="Títulos, personas, géneros"
          class="search-input"
          @blur="handleSearchBlur"
        />
      </div>

      <template v-if="!user">
        <router-link to="/login" class="nav-btn">Iniciar Sesión</router-link>
        <router-link to="/register" class="nav-btn btn-primary">Registrarse</router-link>
      </template>
      <template v-else>
        <div class="user-menu" @click="toggleDropdown" ref="userMenuContainer">
          <div class="user-profile">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="User Avatar" class="avatar" />
            <span class="dropdown-caret">▼</span>
          </div>
          <div class="dropdown-menu" v-if="dropdownOpen">
            <div class="dropdown-header">
              <span class="user-email">{{ user.email }}</span>
            </div>
            <button @click.stop="logout" class="dropdown-item">Cerrar sesión en Netflix</button>
          </div>
        </div>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'
import { useSearch } from '../composables/useSearch'

const user = ref(null)
const router = useRouter()
const isScrolled = ref(false)

const { searchQuery } = useSearch()
const searchActive = ref(false)
const searchInput = ref(null)
const searchContainer = ref(null)

const dropdownOpen = ref(false)
const userMenuContainer = ref(null)

const toggleSearch = async () => {
  searchActive.value = true
  await nextTick()
  if (searchInput.value) {
    searchInput.value.focus()
  }
}

const handleSearchBlur = () => {
  if (!searchQuery.value) {
    searchActive.value = false
  }
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const handleClickOutside = (event) => {
  if (userMenuContainer.value && !userMenuContainer.value.contains(event.target)) {
    dropdownOpen.value = false
  }
  if (searchContainer.value && !searchContainer.value.contains(event.target) && !searchQuery.value) {
    searchActive.value = false
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)

  supabase.auth.getSession().then(({ data: { session } }) => {
    user.value = session?.user || null
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})

const logout = async () => {
  dropdownOpen.value = false
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4rem;
  height: 68px;
  background-color: transparent;
  background-image: linear-gradient(to bottom, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0));
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  box-sizing: border-box;
  transition: background-color 0.4s ease;
}

.navbar-scrolled {
  background-color: #141414;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.navbar-logo a {
  color: #e50914;
  font-family: 'Arial Black', Impact, sans-serif;
  font-size: 2.2rem;
  font-weight: 900;
  text-decoration: none;
  letter-spacing: -1px;
}

.navbar-links-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 1.25rem;
}

.navbar-links-list a {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.4s;
}

.navbar-links-list a:hover {
  color: #b3b3b3;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

/* Search Box Styles */
.search-box {
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  background: transparent;
  transition: all 0.3s ease;
  padding: 4px;
}

.search-active {
  border: 1px solid white;
  background: rgba(0, 0, 0, 0.75);
}

.search-icon-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon {
  width: 20px;
  height: 20px;
}

.search-input {
  width: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: white;
  font-size: 0.85rem;
  outline: none;
  transition: width 0.3s ease, padding 0.3s ease;
}

.search-active .search-input {
  width: 200px;
  padding: 0 10px;
}

.search-input::placeholder {
  color: #8c8c8c;
}

.nav-btn {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.3s;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-primary {
  background-color: #e50914;
}

.btn-primary:hover {
  background-color: #f40612;
}

/* User Menu Dropdown */
.user-menu {
  position: relative;
  cursor: pointer;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}

.dropdown-caret {
  color: white;
  font-size: 0.6rem;
  transition: transform 0.3s;
}

.user-menu:hover .dropdown-caret {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background-color: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  width: 200px;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  z-index: 200;
}

.dropdown-header {
  padding: 0.5rem 1rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 0.5rem;
}

.user-email {
  color: white;
  font-size: 0.85rem;
  word-break: break-all;
}

.dropdown-item {
  background: transparent;
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
  transition: text-decoration 0.2s;
}

.dropdown-item:hover {
  text-decoration: underline;
}
</style>
