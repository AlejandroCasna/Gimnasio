import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

// Antes de cada petición inyectamos el accessToken actualizado
api.interceptors.request.use(config => {
  if (typeof window !== 'undefined' && config.headers) {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
