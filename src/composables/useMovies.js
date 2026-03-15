import { ref } from 'vue'
import { supabase } from '../supabase'

export function useMovies(){

const movies = ref([])
const loading = ref(false)
const error = ref(null)
const isAuthenticated = ref(false)

const fetchMovies = async ()=>{

loading.value = true

const { data:{ session } } =
await supabase.auth.getSession()

isAuthenticated.value = !!session

const { data , error } =
await supabase
.from("Movies")
.select("*")

if(error){

console.error(error)

}

movies.value = data || []

loading.value = false

}

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

const updateMovie = async(id , movie)=>{

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