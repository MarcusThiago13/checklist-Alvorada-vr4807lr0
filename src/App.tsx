import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import Index from './pages/Index'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Index />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)

export default App
