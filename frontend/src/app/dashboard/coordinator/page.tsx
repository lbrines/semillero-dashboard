'use client'

import { RoleGuard } from '@/components/auth/RoleGuard'
import { Header } from '@/components/ui/Header'
import { KPICard } from '@/components/ui/KPICard'
import { Chart } from '@/components/ui/Chart'
import { Table } from '@/components/ui/Table'
import { useDashboardData } from '@/hooks/useDashboardData'

export default function CoordinatorDashboard() {
  const { data, loading, error } = useDashboardData()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando estadísticas del coordinador...</p>
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
    <RoleGuard requiredRole="coordinator">
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Panel del Coordinador
            </h1>
            <p className="text-gray-600">
              Supervisa cohortes, detecta riesgos y analiza el progreso general
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
              type="bar"
              title="Progreso por Cohorte"
            />
            <Chart
              data={data.charts.distribution}
              type="donut"
              title="Distribución de Estudiantes"
            />
          </div>

          {/* Comparación entre Cohortes */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comparación entre Cohortes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.courses?.map((course, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{course.name}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estudiantes:</span>
                      <span className="font-medium">{course.students}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progreso:</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Promedio:</span>
                      <span className="font-medium">{course.averageGrade}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          course.progress >= 80 ? 'bg-green-500' : 
                          course.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.progress >= 80 ? 'bg-green-100 text-green-800' : 
                        course.progress >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {course.progress >= 80 ? 'Excelente' : 
                         course.progress >= 60 ? 'Bueno' : 'En Riesgo'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {course.progress}% completado
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estudiantes por Cohorte */}
          {data.students && data.students.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Estudiantes por Cohorte</h2>
              <Table data={data.students} type="students" />
            </div>
          )}
        </main>
      </div>
    </RoleGuard>
  )
}
