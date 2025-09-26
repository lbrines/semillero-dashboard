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
  allowedRoles?: string[]
  redirectToRoleBasedView?: boolean
}

export function RoleGuard({
  children,
  requiredRole,
  requiredPermission,
  fallbackPath = '/login',
  allowedRoles,
  redirectToRoleBasedView = false
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

    // Handle role-based redirection
    if (redirectToRoleBasedView && role) {
      const roleBasedPaths = {
        'estudiante': '/students',
        'docente': '/teacher',
        'coordinador': '/coordinate',
        'administrador': '/overview'
      }

      const targetPath = roleBasedPaths[role as keyof typeof roleBasedPaths]
      if (targetPath && router.pathname !== targetPath) {
        router.push(targetPath)
        return
      }
    }

    // Check specific role requirement
    if (requiredRole && role !== requiredRole) {
      router.push(fallbackPath)
      return
    }

    // Check if role is in allowed roles list
    if (allowedRoles && role && !allowedRoles.includes(role)) {
      router.push(fallbackPath)
      return
    }

    // Check specific permission requirement
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push(fallbackPath)
      return
    }
  }, [isAuthenticated, isLoading, role, requiredRole, requiredPermission, hasPermission, router, fallbackPath, allowedRoles, redirectToRoleBasedView])

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
          <p style={{ color: '#6c757d', margin: '0 0 15px 0' }}>
            Se requiere rol: {requiredRole}. Tu rol actual: {role}
          </p>
          <button
            onClick={() => router.push('/login')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Volver al Login
          </button>
        </div>
      </div>
    )
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#dc3545', margin: '0 0 10px 0' }}>Acceso Restringido</h2>
          <p style={{ color: '#6c757d', margin: '0 0 15px 0' }}>
            Tu rol ({role}) no tiene acceso a esta función
          </p>
          <button
            onClick={() => router.push('/reports')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Ir a Reportes
          </button>
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
