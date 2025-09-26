'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir a login si no hay usuario autenticado
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/login')
      return
    }

    // Redirigir según rol del usuario
    try {
      const userData = JSON.parse(user)
      switch (userData.role) {
        case 'estudiante':
          router.push('/students')
          break
        case 'docente':
          router.push('/teacher')
          break
        case 'coordinador':
          router.push('/coordinate')
          break
        case 'administrador':
          router.push('/overview')
          break
        default:
          router.push('/login')
      }
    } catch (error) {
      router.push('/login')
    }
  }, [router])

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
        <p style={{ color: '#6c757d', margin: 0 }}>Redirigiendo...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}