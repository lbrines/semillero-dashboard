'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from './AuthProvider'
import { UserRole } from '@/types'

interface RoleGuardProps {
  children: ReactNode
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  fallback?: ReactNode
  redirectTo?: string
}

export const RoleGuard = ({ 
  children, 
  requiredRole, 
  requiredRoles, 
  fallback,
  redirectTo = '/login'
}: RoleGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()

  // Mostrar loading mientras se verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-minimal-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-minimal-body">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated || !user) {
    router.push(redirectTo)
    return null
  }

  // Verificar rol específico
  if (requiredRole && user.role !== requiredRole) {
    if (fallback) {
      return <>{fallback}</>
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta sección.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Rol requerido: {requiredRole} | Tu rol: {user.role}
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Volver al Login
          </button>
        </div>
      </div>
    )
  }

  // Verificar múltiples roles
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta sección.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Roles requeridos: {requiredRoles.join(', ')} | Tu rol: {user.role}
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Volver al Login
          </button>
        </div>
      </div>
    )
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>
}
