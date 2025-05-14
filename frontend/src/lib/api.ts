// frontend/src/lib/api.ts
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

// --- AÑADE ESTE BLOQUE ---
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    // si recibimos 401 y aún no hemos reintentado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // pedimos nuevo access token con el refresh token
        const { data } = await axios.post(
          'http://127.0.0.1:8000/api/token/refresh/',
          { refresh: localStorage.getItem('refreshToken') }
        )
        // guardamos el nuevo access token
        localStorage.setItem('accessToken', data.access)
        // actualizamos cabeceras por defecto y de la petición original
        api.defaults.headers.Authorization = `Bearer ${data.access}`
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        // reintentamos la petición fallida
        return api(originalRequest)
      } catch (refreshError) {
        // si el refresh falla, cae al catch de la llamada original
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)
// --- FIN DEL BLOQUE ---
