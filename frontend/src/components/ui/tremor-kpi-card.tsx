import { Card, Metric, Text, BadgeDelta } from '@tremor/react'

interface TremorKPICardProps {
  title: string
  metric: string | number
  delta?: number
  deltaType?: 'increase' | 'decrease' | 'unchanged'
  color?: 'emerald' | 'red' | 'blue' | 'yellow' | 'purple' | 'orange'
  loading?: boolean
  error?: string | null
}

export function TremorKPICard({ 
  title, 
  metric, 
  delta, 
  deltaType = 'unchanged',
  color = 'blue',
  loading = false,
  error = null
}: TremorKPICardProps) {
  if (loading) {
    return (
      <Card className="max-w-xs mx-auto">
        <Text>{title}</Text>
        <div className="flex items-center justify-center h-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="max-w-xs mx-auto">
        <Text>{title}</Text>
        <Metric className="text-red-500">Error</Metric>
        <Text className="text-red-400 text-sm">{error}</Text>
      </Card>
    )
  }

  return (
    <Card className="max-w-xs mx-auto">
      <Text>{title}</Text>
      <Metric className={`text-${color}-600`}>{metric}</Metric>
      {delta !== undefined && (
        <BadgeDelta deltaType={deltaType} size="sm">
          {delta > 0 ? '+' : ''}{delta}%
        </BadgeDelta>
      )}
    </Card>
  )
}
