import { ref } from 'vue'
import { supabase } from '../supabase'

export function useMovies() {
  const movies = ref([])
  const loading = ref(false)
  const error = ref(null)
  const isAuthenticated = ref(false)

  const fetchMovies = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Check auth status
      const { data: { session } } = await supabase.auth.getSession()
      isAuthenticated.value = !!session
      
      const limit = session ? 100 : 100 // We fetch all we need, filtering happens in Home.vue

      const { data, error: pbError } = await supabase
        .from('Movies')
        .select('*')
        .limit(limit)
        
      if (pbError) throw pbError
      
      movies.value = data || []
      
    } catch (err) {
      console.error('Error fetching movies:', err)
      error.value = 'Error al cargar películas. Verifica tu conexión.'
    } finally {
      loading.value = false
    }
  }

  return {
    movies,
    loading,
    error,
    isAuthenticated,
    fetchMovies
  }
}
