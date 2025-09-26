'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useRole } from '@/contexts/RoleContext'
import { StudentReportsView } from '@/components/views/StudentReportsView'
import { TeacherReportsView } from '@/components/views/TeacherReportsView'
import { CoordinatorReportsView } from '@/components/views/CoordinatorReportsView'
import { AdminReportsView } from '@/components/views/AdminReportsView'

export default function ReportsPage() {
  const { user } = useAuth()
  const { role } = useRole()
  const router = useRouter()

  useEffect(() => {
    if (!role) {
      router.push('/login')
    }
  }, [role, router])

  if (!role) {
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
          <p style={{ color: '#6c757d', margin: 0 }}>Determinando vista de reportes...</p>
        </div>
      </div>
    )
  }

  if (!role) {
    return null
  }

  // Render role-specific view
  switch (role) {
    case 'estudiante':
      return <StudentReportsView />
    case 'docente':
      return <TeacherReportsView />
    case 'coordinador':
      return <CoordinatorReportsView />
    case 'administrador':
      return <AdminReportsView />
    default:
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ textAlign: 'center', color: '#dc3545' }}>
            <p>Rol no reconocido: {role}</p>
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
}