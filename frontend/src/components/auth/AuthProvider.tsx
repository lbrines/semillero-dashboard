'use client'

import { createContext, useContext, ReactNode } from 'react'
import { AuthState, User, UserRole } from '@/types'
import { useAuth } from '@/hooks/useAuth'

interface AuthContextType extends AuthState {
  login: (role: UserRole) => Promise<User>
  loginGoogle: () => Promise<User>
  logout: () => void
  changeMode: (mode: 'mock' | 'google') => void
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
