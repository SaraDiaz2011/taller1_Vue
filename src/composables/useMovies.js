import { ref } from "vue"
import { supabase } from "../supabase"

export function useMovies(){

const movies = ref([])
const loading = ref(false)
const error = ref(null)
const isAuthenticated = ref(false)

const fetchMovies = async ()=>{

loading.value = true

/* VERIFICAR SESIÓN */

const { data:{ session } } =
await supabase.auth.getSession()

isAuthenticated.value = !!session

/* OBTENER PELÍCULAS */

const { data, error } =
await supabase
.from("Movies")
.select("*")
.order("titulo")

if(error){

console.error(error)
error.value = error.message

}

movies.value = data || []

loading.value = false

}

/* AGREGAR */

const addMovie = async(movie)=>{

const { error } =
await supabase
.from("Movies")
.insert([movie])

if(error){
console.error(error)
}

await fetchMovies()

}

/* EDITAR */

const updateMovie = async(id,movie)=>{

const { error } =
await supabase
.from("Movies")
.update(movie)
.eq("id",id)

if(error){
console.error(error)
}

await fetchMovies()

}

/* ELIMINAR */

const deleteMovie = async(id)=>{

const { error } =
await supabase
.from("Movies")
.delete()
.eq("id",id)

if(error){
console.error(error)
}

await fetchMovies()

}

return{

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