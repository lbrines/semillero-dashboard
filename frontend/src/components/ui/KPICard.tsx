// Componente KPI Card minimalista para mostrar métricas principales

import { KPICard as KPICardType } from '@/types'

interface KPICardProps {
  kpi: KPICardType
  className?: string
}

export const KPICard = ({ kpi, className = '' }: KPICardProps) => {
  const getChangeIcon = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return '↗'
      case 'decrease':
        return '↘'
      default:
        return '→'
    }
  }

  const getChangeColor = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-success'
      case 'decrease':
        return 'text-destructive'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className={`card-minimal p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl text-muted-foreground">{kpi.icon}</div>
        {kpi.change !== undefined && (
          <div className={`flex items-center text-minimal-small ${getChangeColor(kpi.changeType)}`}>
            <span className="mr-1">{getChangeIcon(kpi.changeType)}</span>
            <span>{Math.abs(kpi.change)}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-minimal-small font-medium text-muted-foreground">{kpi.title}</h3>
        <p className="text-minimal-h2">{kpi.value}</p>
      </div>
      
      {kpi.change !== undefined && (
        <div className="mt-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-minimal-small font-medium bg-muted text-muted-foreground`}>
            {kpi.changeType === 'increase' ? 'Aumento' : kpi.changeType === 'decrease' ? 'Disminución' : 'Sin cambios'}
          </div>
        </div>
      )}
    </div>
  )
}
