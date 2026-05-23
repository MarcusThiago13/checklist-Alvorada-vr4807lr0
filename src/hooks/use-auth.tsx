import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  signIn: (identifier: string, password: string) => Promise<{ error: any }>
  signOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(pb.authStore.isValid ? pb.authStore.record : null)
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setUser(pb.authStore.isValid ? record : null)
      setIsAuthenticated(pb.authStore.isValid)
    })

    const checkAuth = async () => {
      if (pb.authStore.isValid) {
        const lastActive = localStorage.getItem('last_active')
        const now = new Date().getTime()
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000

        if (lastActive && now - parseInt(lastActive) > SEVEN_DAYS) {
          pb.authStore.clear()
          setLoading(false)
          return
        }

        try {
          await pb.collection('users').authRefresh()
          localStorage.setItem('last_active', now.toString())
        } catch (_) {
          pb.authStore.clear()
        }
      } else {
        if (pb.authStore.record) pb.authStore.clear()
      }
      setLoading(false)
    }

    checkAuth()

    return () => {
      unsubscribe()
    }
  }, [])

  const signIn = async (identifier: string, password: string) => {
    try {
      // Check lockout first
      const checkRes = await pb.send('/backend/v1/auth/check-lockout', {
        method: 'POST',
        body: JSON.stringify({ identifier }),
      })

      if (checkRes.locked) {
        return { error: { message: 'Account locked. Try again later.' } }
      }

      await pb.collection('users').authWithPassword(identifier, password)

      // Reset lockout on success
      await pb.send('/backend/v1/auth/reset-lockout', {
        method: 'POST',
        body: JSON.stringify({ identifier }),
      })

      localStorage.setItem('last_active', new Date().getTime().toString())
      return { error: null }
    } catch (error: any) {
      // Report fail
      try {
        await pb.send('/backend/v1/auth/report-fail', {
          method: 'POST',
          body: JSON.stringify({ identifier }),
        })
      } catch {
        /* intentionally ignored */
      }

      return { error }
    }
  }

  const signOut = () => {
    pb.authStore.clear()
    localStorage.removeItem('last_active')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
