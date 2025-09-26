'use client'

import { RoleGuard } from '@/components/auth/RoleGuard'
import { Header } from '@/components/ui/Header'
import { KPICard } from '@/components/ui/KPICard'
import { Chart } from '@/components/ui/Chart'
import { Table } from '@/components/ui/Table'
import { useDashboardData } from '@/hooks/useDashboardData'

export default function AdminDashboard() {
  const { data, loading, error } = useDashboardData()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando métricas del sistema...</p>
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
    <RoleGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-600">
              Visión general del sistema, métricas globales y salud técnica
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
              title="Distribución de Usuarios"
            />
            <Chart
              data={data.charts.timeline}
              type="line"
              title="Actividad Global Semanal"
            />
          </div>

          {/* Resumen por Roles */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen por Roles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">👨‍🎓</div>
                  <h3 className="text-lg font-semibold text-gray-900">Estudiantes</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Activos:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Promedio:</span>
                    <span className="font-medium">8.4</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">👩‍🏫</div>
                  <h3 className="text-lg font-semibold text-gray-900">Profesores</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Activos:</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cursos:</span>
                    <span className="font-medium">2</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">👨‍💼</div>
                  <h3 className="text-lg font-semibold text-gray-900">Coordinadores</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Activos:</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cohortes:</span>
                    <span className="font-medium">2</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">👨‍💻</div>
                  <h3 className="text-lg font-semibold text-gray-900">Administradores</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Activos:</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Permisos:</span>
                    <span className="font-medium">Completos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estado del Sistema */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Estado del Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Integraciones</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Google API</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Activa
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mock Data</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Activa
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Base de Datos</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Conectada
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas Técnicas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="font-medium">99.9%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tiempo respuesta:</span>
                    <span className="font-medium">120ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Errores (24h):</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600">• 5 usuarios activos</div>
                  <div className="text-gray-600">• 12 entregas evaluadas</div>
                  <div className="text-gray-600">• 3 reportes generados</div>
                  <div className="text-gray-600">• 0 errores reportados</div>
                </div>
              </div>
            </div>
          </div>

          {/* Estudiantes por Cohorte */}
          {data.students && data.students.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Todos los Estudiantes</h2>
              <Table data={data.students} type="students" />
            </div>
          )}
        </main>
      </div>
    </RoleGuard>
  )
}
