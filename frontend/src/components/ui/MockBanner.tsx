'use client'

import { useState } from 'react'
import { X, Info } from 'lucide-react'

interface MockBannerProps {
  className?: string
}

export const MockBanner = ({ className = '' }: MockBannerProps) => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className={`fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-2xl shadow-lg max-w-sm ${className}`}>
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm">MOCK MODE activo</h4>
          <p className="text-xs text-yellow-700 mt-1">
            Datos de demostración. Estas cuentas son solo para ensayos; no requieren registro.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-600 hover:text-yellow-800 transition-colors flex-shrink-0"
          aria-label="Cerrar banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
