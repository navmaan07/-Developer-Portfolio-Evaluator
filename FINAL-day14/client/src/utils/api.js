import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth headers if needed
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed in the future
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.message
      throw new Error(message)
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.')
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
)

export const profileAPI = {
  // Get user profile and generate report
  getProfile: (username) => api.get(`/profile/${username}`),

  // Get cached report only
  getCachedProfile: (username) => api.get(`/profile/${username}/cached`),

  // Compare two profiles
  compareProfiles: (user1, user2) => api.get('/compare', {
    params: { u1: user1, u2: user2 }
  }),

  // Get all cached reports (admin)
  getAllReports: () => api.get('/reports'),
}

export default api
