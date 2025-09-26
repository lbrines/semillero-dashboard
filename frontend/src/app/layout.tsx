import type { Metadata } from 'next'

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
        {children}
      </body>
    </html>
  )
}