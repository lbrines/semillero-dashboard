'use client'

import { RoleGuard } from '@/components/auth/RoleGuard'
import { Header } from '@/components/ui/Header'
import { KPICard } from '@/components/ui/KPICard'
import { Chart } from '@/components/ui/Chart'
import { Table } from '@/components/ui/Table'
import { useDashboardData } from '@/hooks/useDashboardData'

export default function StudentDashboard() {
  const { data, loading, error } = useDashboardData()

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-minimal-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-minimal-body">Cargando tu progreso académico...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-minimal-sm">
            <h2 className="text-minimal-h3 text-destructive">Error</h2>
            <p className="text-minimal-body">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-minimal-sm">
            <h2 className="text-minimal-h3 text-muted-foreground">Sin datos</h2>
            <p className="text-minimal-body">No se encontraron datos para mostrar</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <RoleGuard requiredRole="student">
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container-minimal py-8">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-minimal-h1 mb-3">
              Mi Progreso Académico
            </h1>
            <p className="text-minimal-body text-lg">
              Revisa tu progreso, entregas y calificaciones
            </p>
          </div>

          {/* KPIs */}
          <div className="grid-minimal-4 mb-12">
            {data.kpis.map((kpi, index) => (
              <KPICard key={index} kpi={kpi} />
            ))}
          </div>

          {/* Gráficos */}
          <div className="grid-minimal-2 mb-12">
            <Chart
              data={data.charts.progress}
              type="donut"
              title="Distribución de Entregas"
            />
            <Chart
              data={data.charts.timeline}
              type="line"
              title="Actividad Semanal"
            />
          </div>

          {/* Mis Cursos */}
          <div className="mb-12">
            <h2 className="text-minimal-h3 mb-8">Mis Cursos</h2>
            <div className="grid-minimal-2">
              {data.charts.distribution.map((course, index) => (
                <div key={index} className="card-minimal p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-minimal-h4">{course.name}</h3>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                  </div>
                  <div className="space-minimal-sm">
                    <div className="flex justify-between text-minimal-small">
                      <span className="text-muted-foreground">Progreso:</span>
                      <span className="font-medium">{course.value} entregas</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${(course.value / 10) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mis Entregas Recientes */}
          {data.tasks && data.tasks.length > 0 && (
            <div>
              <h2 className="text-minimal-h3 mb-8">Mis Entregas Recientes</h2>
              <Table data={data.tasks} type="tasks" />
            </div>
          )}
        </main>
      </div>
    </RoleGuard>
  )
}
