'use client'

import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge } from '@tremor/react'
import { TableColumn } from '@/types'

interface DataTableProps<T> {
  title: string
  description?: string
  data: T[]
  columns: TableColumn<T>[]
  className?: string
  showHeader?: boolean
  striped?: boolean
  compact?: boolean
}

export const DataTable = <T,>({
  title,
  description,
  data,
  columns,
  className = '',
  showHeader = true,
  striped = true,
  compact = false
}: DataTableProps<T>) => {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activo':
      case 'completado':
      case 'aprobado':
        return <Badge color="green">{status}</Badge>
      case 'pendiente':
      case 'en progreso':
        return <Badge color="yellow">{status}</Badge>
      case 'riesgo':
      case 'atrasado':
      case 'rechazado':
        return <Badge color="red">{status}</Badge>
      case 'pausado':
      case 'en revisión':
        return <Badge color="blue">{status}</Badge>
      default:
        return <Badge color="gray">{status}</Badge>
    }
  }

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      <Table className={`${compact ? 'text-sm' : ''}`}>
        {showHeader && (
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableHeaderCell key={index} className="font-semibold">
                  {column.header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {data.map((item, rowIndex) => (
            <TableRow 
              key={rowIndex} 
              className={`${striped && rowIndex % 2 === 0 ? 'bg-muted/30' : ''} hover:bg-muted/50 transition-colors`}
            >
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column.render ? (
                    column.render(item)
                  ) : (
                    <span>
                      {typeof column.key === 'string' 
                        ? (item as any)[column.key]
                        : String((item as any)[column.key])
                      }
                    </span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay datos disponibles</p>
        </div>
      )}
    </Card>
  )
}
