// frontend/src/lib/api.ts
import axios from 'axios'

// Creamos la instancia apuntando siempre a /api/
export const api = axios.create({
  baseURL: '/api/',
  withCredentials: false,
})

// Inyectar el access token en cada petición
api.interceptors.request.use(config => {
  if (typeof window !== 'undefined' && config.headers) {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Manejo automático de 401 → refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // Usamos ruta relativa de nuevo
        const { data } = await axios.post(
          '/api/token/refresh/',
          { refresh: localStorage.getItem('refreshToken') },
          { headers: { 'Content-Type': 'application/json' } }
        )
        // Actualizamos tokens
        localStorage.setItem('accessToken', data.access)
        api.defaults.headers.Authorization = `Bearer ${data.access}`
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        // Reintentar la petición original
        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

/** helper para crear preference de MercadoPago */
export async function createPreference(data: { product_id: string; amount: number }) {
  const res = await fetch('/api/crear_preference/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<{ id: string; init_point: string }>
}
