// frontend/src/lib/api.ts
import axios from 'axios'


const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || ''
console.log('🚀 FRONTEND usando BACKEND URL =', BACKEND)


export const api = axios.create({
  baseURL: `${BACKEND}/api/`,
  withCredentials: false,
})

// inyectar el token en cada petición
api.interceptors.request.use(config => {
  if (typeof window !== 'undefined' && config.headers) {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// refresco de token (401)
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // ¡ojo! usa BACKEND
        const { data } = await axios.post(
          `${BACKEND}/api/token/refresh/`,
          { refresh: localStorage.getItem('refreshToken') },
        )
        localStorage.setItem('accessToken', data.access)
        api.defaults.headers.Authorization = `Bearer ${data.access}`
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

/** helper para crear preference de MP */
export async function createPreference(data: { product_id: string, amount: number }) {
  const res = await fetch(
    `${BACKEND}/api/crear_preference/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  )
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<{ id: string, init_point: string }>
}
