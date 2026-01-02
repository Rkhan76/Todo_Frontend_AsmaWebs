import api from '../config/axiosConfig'

export const registerUser = async (data) => {
    
  try {
    const response = await api.post('/auth/register', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export const loginUser = async (data) => {
  try {
    const response = await api.post('/auth/login', data)
    console.log(response)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
