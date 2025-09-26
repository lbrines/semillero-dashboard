'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/auth/AuthProvider'

export default function HomePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthContext()

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirigir al dashboard correspondiente según el rol
      router.push(`/dashboard/${user.role}`)
    } else {
      // Si no está autenticado, redirigir al login
      router.push('/login')
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-minimal-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-minimal-body">Redirigiendo...</p>
      </div>
    </div>
  )
}