import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuth, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    )
  }

  if (!isAuth) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location }} // 🔥 remember original page
      />
    )
  }

  return children
}
