import { createContext, useContext, useEffect, useState } from 'react'
import axiosConfig from '../config/axiosConfig'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
 const [user, setUser] = useState(null)

  const checkAuth = async () => {
    try {
      const res = await axiosConfig.get('/auth/me')
      
       setUser(res.data.user)
      setIsAuth(true)
    } catch {
      setIsAuth(false)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await axiosConfig.post('/auth/logout')
    } finally {
      setUser(null)  
      setIsAuth(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        loading,
        user,
        logout,
        checkAuth, // ✅ NOW AVAILABLE
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
