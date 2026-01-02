import axios from 'axios'

const axiosConfig = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // send HTTP-only cookies
})

export default axiosConfig
