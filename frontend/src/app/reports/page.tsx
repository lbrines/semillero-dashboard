'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
// Componentes eliminados - imports removidos

export default function ReportsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Reportes
          </h1>
          <p className="text-gray-600 mb-8">
            Los componentes de reportes han sido eliminados del sistema.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Nota:</strong> Las vistas de reportes específicas por rol han sido removidas como parte de la limpieza del sistema.
            </p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Volver al Login
          </button>
        </div>
      </div>
    </div>
  )
}