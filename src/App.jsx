import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './routes/ProtectedRoutes'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { isAuth, loading } = useAuth()

  // 🔑 Wait until auth check finishes
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <Routes>
      {/* Root route */}
      <Route
        path="/"
        element={<Navigate to={isAuth ? '/dashboard' : '/auth'} replace />}
      />

      {/* Auth route */}
      <Route
        path="/auth"
        element={isAuth ? <Navigate to="/dashboard" replace /> : <Auth />}
      />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
