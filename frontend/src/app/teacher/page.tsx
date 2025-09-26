'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/auth/AuthProvider'

export default function TeacherPage() {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo al dashboard...</p>
      </div>
    </div>
  )
}