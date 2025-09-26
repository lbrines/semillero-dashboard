'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRole } from '@/contexts/RoleContext'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

interface RoleGuardProps {
  children: ReactNode
  requiredRole?: string
  requiredPermission?: string
  fallbackPath?: string
}

export function RoleGuard({ 
  children, 
  requiredRole, 
  requiredPermission, 
  fallbackPath = '/login' 
}: RoleGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const { role, hasPermission } = useRole()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (requiredRole && role !== requiredRole) {
      router.push(fallbackPath)
      return
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push(fallbackPath)
      return
    }
  }, [isAuthenticated, isLoading, role, requiredRole, requiredPermission, hasPermission, router, fallbackPath])

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #3498db', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#6c757d', margin: 0 }}>Verificando permisos...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#dc3545', margin: '0 0 10px 0' }}>Acceso Denegado</h2>
          <p style={{ color: '#6c757d', margin: 0 }}>No tienes permisos para acceder a esta página</p>
        </div>
      </div>
    )
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#dc3545', margin: '0 0 10px 0' }}>Permisos Insuficientes</h2>
          <p style={{ color: '#6c757d', margin: 0 }}>No tienes los permisos necesarios para esta acción</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
