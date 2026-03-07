import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import { supabase } from '../supabase'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login, meta: { requiresGuest: true } },
    { path: '/register', name: 'Register', component: Register, meta: { requiresGuest: true } }
  ]
})

// Navigation guard
router.beforeEach(async (to) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (to.meta.requiresAuth && !session) {
    return '/login'
  }
  if (to.meta.requiresGuest && session) {
    return '/'
  }
})

export default router
