'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LoginFormData {
  email: string
  password: string
  mode: 'mock' | 'google'
}

interface User {
  email: string
  role: string
  name: string
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    mode: 'mock'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Mock users para modo MOCK
  const mockUsers: Record<string, User> = {
    'student@example.com': { email: 'student@example.com', role: 'estudiante', name: 'Juan Estudiante' },
    'teacher@example.com': { email: 'teacher@example.com', role: 'docente', name: 'María Profesora' },
    'coord@example.com': { email: 'coord@example.com', role: 'coordinador', name: 'Carlos Coordinador' },
    'admin@example.com': { email: 'admin@example.com', role: 'administrador', name: 'Ana Administradora' }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (formData.mode === 'mock') {
        // Validación en modo MOCK
        const user = mockUsers[formData.email]
        if (!user) {
          throw new Error('Email no autorizado. Usa: student@example.com, teacher@example.com, coord@example.com, admin@example.com')
        }

        // Simular autenticación exitosa
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Guardar datos de usuario en localStorage
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('auth_mode', 'mock')
        
        // Redirigir según rol
        redirectByRole(user.role)
      } else {
        // Modo GOOGLE (placeholder para futura implementación)
        throw new Error('Modo Google OAuth no implementado aún')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación')
    } finally {
      setLoading(false)
    }
  }

  const redirectByRole = (role: string) => {
    switch (role) {
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
        router.push('/')
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#2c3e50', 
            margin: '0 0 10px 0',
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            Semillero Dashboard
          </h1>
          <p style={{ 
            color: '#6c757d', 
            margin: 0,
            fontSize: '16px'
          }}>
            Inicia sesión para acceder
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#495057'
            }}>
              Modo de Autenticación
            </label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '16px',
                backgroundColor: 'white'
              }}
            >
              <option value="mock">Modo MOCK (Demo)</option>
              <option value="google">Modo Google OAuth</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#495057'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu@email.com"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#495057'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
              border: '1px solid #f5c6cb'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ 
          marginTop: '30px', 
          padding: '20px',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#495057'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Usuarios de Prueba (Modo MOCK):</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>Estudiante:</strong> student@example.com</li>
            <li><strong>Profesor:</strong> teacher@example.com</li>
            <li><strong>Coordinador:</strong> coord@example.com</li>
            <li><strong>Administrador:</strong> admin@example.com</li>
          </ul>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
            Contraseña: cualquier valor
          </p>
        </div>
      </div>
    </div>
  )
}
