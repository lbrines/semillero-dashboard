import type { Metadata } from 'next'
import { AuthProvider } from '@/components/auth/AuthProvider'

export const metadata: Metadata = {
  title: 'Semillero Dashboard',
  description: 'Dashboard para gestión de cursos y estudiantes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}