// Componente Chart para visualizaciones simples

import { ChartData } from '@/types'

interface ChartProps {
  data: ChartData[]
  type: 'bar' | 'donut' | 'line'
  title?: string
  className?: string
}

export const Chart = ({ data, type, title, className = '' }: ChartProps) => {
  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(d => d.value))
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-sm text-gray-600 truncate mr-3">
              {item.name}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div
                className="h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || '#3B82F6'
                }}
              >
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderDonutChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let cumulativePercentage = 0

    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const strokeDasharray = `${percentage} ${100 - percentage}`
            const strokeDashoffset = -cumulativePercentage
            cumulativePercentage += percentage

            return (
              <circle
                key={index}
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke={item.color || '#3B82F6'}
                strokeWidth="4"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700">{total}</span>
        </div>
      </div>
    )
  }

  const renderLineChart = () => {
    const maxValue = Math.max(...data.map(d => d.value))
    const minValue = Math.min(...data.map(d => d.value))
    const range = maxValue - minValue

    return (
      <div className="h-32 flex items-end justify-between px-2">
        {data.map((item, index) => {
          const height = range > 0 ? ((item.value - minValue) / range) * 100 : 50
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className="w-8 rounded-t"
                style={{
                  height: `${height}%`,
                  backgroundColor: item.color || '#3B82F6',
                  minHeight: '4px'
                }}
              />
              <div className="text-xs text-gray-600 mt-2">{item.name}</div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart()
      case 'donut':
        return renderDonutChart()
      case 'line':
        return renderLineChart()
      default:
        return <div>Tipo de gráfico no soportado</div>
    }
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      {renderChart()}
      {type === 'donut' && (
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center text-sm">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color || '#3B82F6' }}
              />
              <span className="text-gray-600">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
