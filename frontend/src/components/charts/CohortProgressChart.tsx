import { BarChart } from '@tremor/react'

interface ChartDataPoint {
  name: string
  onTime: number
  late: number
  percentage: number
}

interface CohortProgressChartProps {
  data: ChartDataPoint[]
  loading?: boolean
  error?: string | null
}

export function CohortProgressChart({ data, loading, error }: CohortProgressChartProps) {
  if (loading) {
    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Progreso de Entregas por Cohorte</h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p style={{ color: '#6c757d', margin: 0 }}>Cargando gráfico...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Progreso de Entregas por Cohorte</h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px'
        }}>
          <div style={{ color: '#dc3545', textAlign: 'center' }}>
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Progreso de Entregas por Cohorte</h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px'
        }}>
          <div style={{ color: '#6c757d', textAlign: 'center' }}>
            <p>No hay datos disponibles</p>
          </div>
        </div>
      </div>
    )
  }

  // Transform data for Tremor chart
  const chartData = data.map(item => ({
    name: item.name,
    'A tiempo': item.onTime,
    'Tardías': item.late,
  }))

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Progreso de Entregas por Cohorte</h3>
      <p style={{ margin: '0 0 20px 0', color: '#6c757d', fontSize: '14px' }}>
        Comparación de entregas a tiempo vs entregas tardías por cohorte
      </p>

      <BarChart
        data={chartData}
        index="name"
        categories={['A tiempo', 'Tardías']}
        colors={['emerald', 'red']}
        valueFormatter={(number: number) => `${number} entregas`}
        yAxisWidth={60}
        onValueChange={(v) => console.log(v)}
        className="h-80"
      />

      {/* Summary stats */}
      <div style={{
        marginTop: '20px',
        paddingTop: '15px',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-around',
        fontSize: '14px'
      }}>
        {data.map((item, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{item.name}</div>
            <div style={{ color: '#28a745' }}>{item.percentage.toFixed(1)}% a tiempo</div>
          </div>
        ))}
      </div>
    </div>
  )
}
