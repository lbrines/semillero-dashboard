'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/auth/AuthProvider'
import { UserRole } from '@/types'
import { MockBanner } from '@/components/ui/MockBanner'
import { Settings, BarChart3, BookOpen, GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function AccessPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { user, isAuthenticated, mode, login, loginGoogle, changeMode } = useAuthContext()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(`/dashboard/${user.role}`)
    }
  }, [isAuthenticated, user, router])

  const handleRoleSelection = async (role: UserRole) => {
    setLoading(true)

    try {
      await login(role)
      // La redirección se maneja en el useEffect
    } catch (err) {
      console.error('Error en selección de rol:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMockLogin = async (role: UserRole, mockEmail: string, mockPassword: string) => {
    setLoading(true)
    setEmail(mockEmail)
    setPassword(mockPassword)

    try {
      await login(role)
      // La redirección se maneja en el useEffect
    } catch (err) {
      console.error('Error en login mock:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)

    try {
      await loginGoogle()
      // La redirección se maneja en el useEffect
    } catch (err) {
      console.error('Error en login con Google:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleModeChange = (newMode: 'mock' | 'google') => {
    changeMode(newMode)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <MockBanner />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">S</span>
            </div>
            <h1 className="text-semillero-h1 mb-2">Semillero Dashboard</h1>
            <p className="text-semillero-body">
              Accede al sistema de gestión académica
            </p>
          </div>

          {/* Formulario de login */}
          <div className="card-semillero p-8 mb-6">
            <h2 className="text-semillero-h3 mb-6 text-center">Iniciar Sesión</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-semillero pl-10"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-semillero pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="btn-outline w-full h-12 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </button>
            </div>
          </div>

          {/* Botones MOCK */}
          <div className="card-semillero p-6">
            <h3 className="text-semillero-h4 mb-4 text-center">Acceso Rápido (MOCK)</h3>
            <p className="text-semillero-small text-center mb-6">
              Iniciá sesión con cualquiera de estos usuarios de prueba. Estas cuentas son solo para ensayos; no requieren registro.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleMockLogin('admin', 'admin@semillero.digital', 'admin123')}
                disabled={loading}
                className="btn-admin h-12 flex items-center justify-center gap-2"
              >
                <Settings className="h-4 w-4" />
                <span className="text-xs">Admin</span>
              </button>
              
              <button
                onClick={() => handleMockLogin('coordinator', 'coordinador@semillero.digital', 'coord123')}
                disabled={loading}
                className="btn-coordinator h-12 flex items-center justify-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs">Coord</span>
              </button>
              
              <button
                onClick={() => handleMockLogin('teacher', 'profesor1@semillero.digital', 'teacher123')}
                disabled={loading}
                className="btn-teacher h-12 flex items-center justify-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                <span className="text-xs">Docente</span>
              </button>
              
              <button
                onClick={() => handleMockLogin('student', 'estudiante1@semillero.digital', 'student123')}
                disabled={loading}
                className="btn-student h-12 flex items-center justify-center gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                <span className="text-xs">Estudiante</span>
              </button>
            </div>
          </div>

          {/* Modo de operación */}
          <div className="text-center mt-6">
            <div className="inline-flex bg-white rounded-2xl p-1 shadow-md">
              <button
                onClick={() => handleModeChange('mock')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  mode === 'mock' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                MOCK
              </button>
              <button
                onClick={() => handleModeChange('google')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  mode === 'google' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                GOOGLE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}