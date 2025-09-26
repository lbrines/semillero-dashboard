'use client'

import { useOverviewStats } from '@/hooks/useOverviewStats'
import { useKPIs } from '@/hooks/useKPIs'
import { useCohortProgress } from '@/hooks/useCohortProgress'
import { CohortProgressChart } from '@/components/charts/CohortProgressChart'
import { TremorKPICard } from '@/components/ui/tremor-kpi-card'
import { useAuth } from '@/contexts/AuthContext'
import { Card, Grid, Title, Text, Badge } from '@tremor/react'

export function AdminReportsView() {
  const { user, logout } = useAuth()
  const { stats: overviewStats, loading: overviewLoading, error: overviewError } = useOverviewStats()
  const { kpis, loading: kpisLoading, error: kpisError } = useKPIs()
  const { data: cohortData, loading: cohortLoading, error: cohortError } = useCohortProgress()

  if (overviewLoading || kpisLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
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
          <p style={{ color: '#6c757d', margin: 0 }}>Cargando reportes globales...</p>
        </div>
      </div>
    )
  }

  if (overviewError || kpisError) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center', color: '#dc3545' }}>
          <p>Error: {overviewError || kpisError}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e9ecef'
      }}>
        <div>
          <Title>Reportes Administrativos</Title>
          <Text>
            Administrador: {user?.name || 'Admin'} 🔧 - Acceso Completo al Sistema
          </Text>
          {(overviewStats?.demo_mode || kpis?.demo_mode) && (
            <Badge color="yellow" className="mt-2">
              MODO {(overviewStats?.demo_mode || kpis?.demo_mode || 'mock').toUpperCase()}
            </Badge>
          )}
        </div>
        <button
          onClick={logout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* System Overview KPIs with Tremor */}
      <div style={{ marginBottom: '30px' }}>
        <Title>Vista General del Sistema</Title>
        <Text>Métricas clave del sistema educativo</Text>
        <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6 mt-6">
          <TremorKPICard
            title="Total Estudiantes"
            metric={kpis?.totalStudents || overviewStats?.totalStudents || 0}
            color="blue"
            loading={kpisLoading || overviewLoading}
            error={kpisError || overviewError}
          />
          <TremorKPICard
            title="Total Cursos"
            metric={kpis?.totalCourses || overviewStats?.totalActiveCourses || 0}
            color="emerald"
            loading={kpisLoading || overviewLoading}
            error={kpisError || overviewError}
          />
          <TremorKPICard
            title="Total Profesores"
            metric={overviewStats?.totalTeachers || 0}
            color="purple"
            loading={overviewLoading}
            error={overviewError}
          />
          <TremorKPICard
            title="Tasa de Retención"
            metric={`${overviewStats?.retentionRate || 0}%`}
            color="blue"
            loading={overviewLoading}
            error={overviewError}
          />
        </Grid>
      </div>

      {/* Performance KPIs */}
      <div style={{ marginBottom: '30px' }}>
        <Title>Métricas de Rendimiento</Title>
        <Text>Indicadores de desempeño académico</Text>
        <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6 mt-6">
          <TremorKPICard
            title="Tasa de Completitud"
            metric={`${overviewStats?.completionRate || 0}%`}
            color="yellow"
            loading={overviewLoading}
            error={overviewError}
          />
          <TremorKPICard
            title="Promedio General"
            metric={overviewStats?.averageGrade || 0}
            color="emerald"
            loading={overviewLoading}
            error={overviewError}
          />
          <TremorKPICard
            title="Estudiantes en Riesgo"
            metric={overviewStats?.studentsAtRisk || 0}
            color={overviewStats?.studentsAtRisk && overviewStats.studentsAtRisk > 0 ? "red" : "emerald"}
            loading={overviewLoading}
            error={overviewError}
          />
          <TremorKPICard
            title="Entregas Tardías"
            metric={kpis?.lateSubmissions || 0}
            color="red"
            loading={kpisLoading}
            error={kpisError}
          />
        </Grid>
      </div>

      {/* Cohort Progress Chart */}
      <Card className="mt-6">
        <Title>Progreso de Cohorte</Title>
        <Text>Análisis de entregas por cohorte</Text>
        <div className="mt-6">
          <CohortProgressChart 
            data={cohortData?.chartData || []} 
            loading={cohortLoading}
            error={cohortError}
          />
        </div>
      </Card>

      {/* System Health */}
      <Card className="mt-6">
        <Title>Estado del Sistema</Title>
        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6 mt-6">
          <div className="text-center">
            <Text>Modo de Datos</Text>
            <Badge color="blue" className="mt-2">
              {overviewStats?.demo_mode || kpis?.demo_mode || 'mock'}
            </Badge>
          </div>
          <div className="text-center">
            <Text>Total de Entregas</Text>
            <Text className="text-2xl font-bold text-blue-600">
              {kpis?.totalSubmissions || 0}
            </Text>
          </div>
          <div className="text-center">
            <Text>Promedio de Completitud</Text>
            <Text className="text-2xl font-bold text-emerald-600">
              {kpis?.averageCompletionRate || 0}%
            </Text>
          </div>
        </Grid>
      </Card>
    </div>
  )
}
