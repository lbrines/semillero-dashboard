'use client'

import { Card, Title, Text } from '@tremor/react'
import { BarChart, LineChart, DonutChart, AreaChart } from '@tremor/react'
import { ChartData } from '@/types'

interface ChartCardProps {
  title: string
  description?: string
  data: ChartData[]
  type: 'bar' | 'line' | 'donut' | 'area'
  className?: string
  height?: number
  showLegend?: boolean
  showTooltip?: boolean
}

export const ChartCard = ({
  title,
  description,
  data,
  type,
  className = '',
  height = 300,
  showLegend = true,
  showTooltip = true
}: ChartCardProps) => {
  const renderChart = () => {
    const commonProps = {
      data,
      height,
      showLegend,
      showTooltip,
      className: 'mt-6'
    }

    switch (type) {
      case 'bar':
        return (
          <BarChart
            {...commonProps}
            index="name"
            categories={['value']}
            colors={['blue']}
          />
        )
      case 'line':
        return (
          <LineChart
            {...commonProps}
            index="name"
            categories={['value']}
            colors={['blue']}
            curveType="natural"
          />
        )
      case 'donut':
        return (
          <DonutChart
            {...commonProps}
            index="name"
            category="value"
            colors={['blue', 'green', 'purple', 'orange', 'red']}
          />
        )
      case 'area':
        return (
          <AreaChart
            {...commonProps}
            index="name"
            categories={['value']}
            colors={['blue']}
          />
        )
      default:
        return null
    }
  }

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="mb-4">
        <Title className="text-lg font-semibold text-foreground">
          {title}
        </Title>
        {description && (
          <Text className="text-sm text-muted-foreground mt-1">
            {description}
          </Text>
        )}
      </div>
      {renderChart()}
    </Card>
  )
}
