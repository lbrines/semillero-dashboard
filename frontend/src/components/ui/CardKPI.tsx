'use client'

import { Card, Metric, Text, BadgeDelta, Flex } from '@tremor/react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface CardKPIProps {
  title: string
  value: string | number
  unit?: string
  delta?: number
  deltaType?: 'increase' | 'decrease' | 'unchanged'
  icon?: React.ReactNode
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'yellow'
  className?: string
}

export const CardKPI = ({
  title,
  value,
  unit,
  delta,
  deltaType = 'unchanged',
  icon,
  color = 'green',
  className = ''
}: CardKPIProps) => {
  const getDeltaIcon = () => {
    switch (deltaType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4" />
      case 'decrease':
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'text-green-600'
      case 'blue':
        return 'text-blue-600'
      case 'purple':
        return 'text-purple-600'
      case 'orange':
        return 'text-orange-600'
      case 'red':
        return 'text-red-600'
      case 'yellow':
        return 'text-yellow-600'
      default:
        return 'text-green-600'
    }
  }

  return (
    <Card className={`p-6 hover:shadow-xl transition-all duration-200 ${className}`}>
      <Flex alignItems="start">
        <div className="flex-1">
          <Text className="text-sm font-medium text-muted-foreground mb-2">
            {title}
          </Text>
          <Metric className="text-3xl font-bold text-foreground">
            {value}
            {unit && <span className="text-lg font-normal text-muted-foreground ml-1">{unit}</span>}
          </Metric>
          {delta !== undefined && (
            <div className="mt-3 flex items-center gap-2">
              <BadgeDelta
                deltaType={deltaType}
                size="sm"
                className="text-xs"
              >
                {delta > 0 ? '+' : ''}{delta}%
              </BadgeDelta>
              <span className="text-xs text-muted-foreground">
                vs mes anterior
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-2xl bg-muted ${getColorClasses()}`}>
            {icon}
          </div>
        )}
      </Flex>
    </Card>
  )
}
