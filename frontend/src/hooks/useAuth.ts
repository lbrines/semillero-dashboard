// Hook personalizado para manejo de autenticación

import { useState, useEffect } from 'react'
import { AuthState, User, UserRole } from '@/types'
import { 
  getAuthState, 
  subscribeToAuth, 
  loginWithRole, 
  loginWithGoogle, 
  logout, 
  setMode,
  restoreSession,
  hasRole,
  hasAnyRole
} from '@/lib/auth'

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(getAuthState())

  useEffect(() => {
    // Restaurar sesión al cargar
    restoreSession()

    // Suscribirse a cambios de estado
    const unsubscribe = subscribeToAuth((newState) => {
      setAuthState(newState)
    })

    return unsubscribe
  }, [])

  const login = async (role: UserRole) => {
    return await loginWithRole(role)
  }

  const loginGoogle = async () => {
    return await loginWithGoogle()
  }

  const logoutUser = () => {
    logout()
  }

  const changeMode = (mode: 'mock' | 'google') => {
    setMode(mode)
  }

  const checkRole = (role: UserRole) => {
    return hasRole(role)
  }

  const checkAnyRole = (roles: UserRole[]) => {
    return hasAnyRole(roles)
  }

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    mode: authState.mode,
    login,
    loginGoogle,
    logout: logoutUser,
    changeMode,
    hasRole: checkRole,
    hasAnyRole: checkAnyRole
  }
}
