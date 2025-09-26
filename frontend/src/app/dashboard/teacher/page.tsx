'use client'

import { RoleGuard } from '@/components/auth/RoleGuard'
import { Header } from '@/components/ui/Header'
import { KPICard } from '@/components/ui/KPICard'
import { Chart } from '@/components/ui/Chart'
import { Table } from '@/components/ui/Table'
import { useDashboardData } from '@/hooks/useDashboardData'

export default function TeacherDashboard() {
  const { data, loading, error } = useDashboardData()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando estadísticas del profesor...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Sin datos</h2>
            <p className="text-gray-500">No se encontraron datos para mostrar</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <RoleGuard requiredRole="teacher">
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Panel del Profesor
            </h1>
            <p className="text-gray-600">
              Gestiona tus cursos, estudiantes y evaluaciones
            </p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {data.kpis.map((kpi, index) => (
              <KPICard key={index} kpi={kpi} />
            ))}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Chart
              data={data.charts.progress}
              type="donut"
              title="Estado de Evaluaciones"
            />
            <Chart
              data={data.charts.timeline}
              type="line"
              title="Actividad de Evaluación"
            />
          </div>

          {/* Mis Cursos */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Cursos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.charts.distribution.map((course, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Evaluaciones:</span>
                      <span className="font-medium">{course.value} completadas</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(course.value / 15) * 100}%`,
                          backgroundColor: course.color
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mis Estudiantes */}
          {data.students && data.students.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Estudiantes</h2>
              <Table data={data.students} type="students" />
            </div>
          )}

          {/* Entregas Pendientes */}
          {data.tasks && data.tasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Entregas Pendientes de Evaluación</h2>
              <Table data={data.tasks} type="tasks" />
            </div>
          )}
        </main>
      </div>
    </RoleGuard>
  )
}
