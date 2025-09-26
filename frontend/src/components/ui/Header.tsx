// Componente Header minimalista para navegación y información del usuario

import { useAuthContext } from '@/components/auth/AuthProvider'

export const Header = () => {
  const { user, logout, mode } = useAuthContext()

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'student':
        return 'Estudiante'
      case 'teacher':
        return 'Profesor'
      case 'coordinator':
        return 'Coordinador'
      case 'admin':
        return 'Administrador'
      default:
        return role
    }
  }

  if (!user) return null

  return (
    <header className="border-b bg-background">
      <div className="container-minimal">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <h1 className="text-minimal-h4">
              Semillero Dashboard
            </h1>
          </div>

          {/* Información del usuario y controles */}
          <div className="flex items-center space-x-6">
            {/* Badge de modo */}
            <div className={`px-3 py-1 rounded-full text-minimal-small font-medium ${
              mode === 'mock' 
                ? 'bg-warning/10 text-warning' 
                : 'bg-success/10 text-success'
            }`}>
              {mode === 'mock' ? 'MOCK' : 'GOOGLE'}
            </div>

            {/* Información del usuario */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-minimal-small font-medium">{user.name}</p>
                <p className="text-minimal-small text-muted-foreground">{user.email}</p>
              </div>
              
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-minimal-small font-medium text-muted-foreground">
                {user.avatar || user.name.charAt(0)}
              </div>

              {/* Badge de rol */}
              <div className="px-3 py-1 rounded-full text-minimal-small font-medium bg-muted text-muted-foreground">
                {getRoleDisplayName(user.role)}
              </div>
            </div>

            {/* Botón de logout */}
            <button
              onClick={logout}
              className="btn-minimal bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
