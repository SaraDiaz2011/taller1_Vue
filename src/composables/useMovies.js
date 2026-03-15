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
    
    const { data: { session } } = await supabase.auth.getSession()
    isAuthenticated.value = !!session

    const { data, error: pbError } = await supabase
      .from('Movies')
      .select('*')

    if (pbError) throw pbError

    movies.value = data || []
    loading.value = false
  }

  // ➕ CREAR PELÍCULA
  const addMovie = async (movie) => {
    const { error } = await supabase
      .from('Movies')
      .insert([movie])

    if (error) throw error

    await fetchMovies()
  }

  // ✏️ EDITAR PELÍCULA
  const updateMovie = async (id, movie) => {
    const { error } = await supabase
      .from('Movies')
      .update(movie)
      .eq('id', id)

    if (error) throw error

    await fetchMovies()
  }

  // 🗑️ ELIMINAR PELÍCULA
  const deleteMovie = async (id) => {
    const { error } = await supabase
      .from('Movies')
      .delete()
      .eq('id', id)

    if (error) throw error

    await fetchMovies()
  }

  return {
    movies,
    loading,
    error,
    isAuthenticated,
    fetchMovies,
    addMovie,
    updateMovie,
    deleteMovie
  }
}