import axios from 'axios'

// Usa la URL del backend desde las variables de entorno
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

// Cliente Axios configurado
export const api = axios.create({
  baseURL: BACKEND_URL + '/api/',
  withCredentials: false,
})

// Inyecta token en cada petición
api.interceptors.request.use(config => {
  if (typeof window !== 'undefined' && config.headers) {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Refresh token automático si expira
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const { data } = await axios.post(
          `${BACKEND_URL}/api/token/refresh/`,
          { refresh: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        )
        localStorage.setItem('accessToken', data.access)
        api.defaults.headers.Authorization = `Bearer ${data.access}`
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch {
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

// Helper para MercadoPago
export async function createPreference(data: { product_id: string; amount: number }) {
  const res = await fetch(`${BACKEND_URL}/api/crear_preference/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<{ id: string; init_point: string }>
}
