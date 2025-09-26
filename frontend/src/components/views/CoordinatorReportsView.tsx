'use client'

import { useCoordinatorStats } from '@/hooks/useCoordinatorStats'
import { useCohortProgress } from '@/hooks/useCohortProgress'
import { CohortProgressChart } from '@/components/charts/CohortProgressChart'
import { useAuth } from '@/contexts/AuthContext'

export function CoordinatorReportsView() {
  const { user, logout } = useAuth()
  const { stats, loading, error } = useCoordinatorStats()
  const { data: cohortData, loading: cohortLoading, error: cohortError } = useCohortProgress()

  if (loading) {
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

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center', color: '#dc3545' }}>
          <p>{error}</p>
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
        borderBottom: '2px solid #e0e0e0'
      }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>Reportes de Coordinación</h1>
          <p style={{ margin: 0, color: '#6c757d' }}>
            {stats?.coordinator_name || user?.name || 'Coordinador/a'} - Vista Global de Cohortes 📊
          </p>
          {stats?.demo_mode && (
            <span style={{
              backgroundColor: '#ffc107',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              marginTop: '5px',
              display: 'inline-block'
            }}>
              MODO {stats.demo_mode.toUpperCase()}
            </span>
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

      {/* Global KPIs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Total Cohortes</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {stats?.totalCohorts || 0}
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Total Estudiantes</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {stats?.totalStudents || 0}
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Total Profesores</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
            {stats?.totalTeachers || 0}
          </p>
        </div>

        <div style={{
          backgroundColor: stats?.cohortsAtRisk && stats.cohortsAtRisk > 0 ? '#f8d7da' : '#d4edda',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: `1px solid ${stats?.cohortsAtRisk && stats.cohortsAtRisk > 0 ? '#dc3545' : '#28a745'}`
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Cohortes en Riesgo</h3>
          <p style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            color: stats?.cohortsAtRisk && stats.cohortsAtRisk > 0 ? '#dc3545' : '#28a745'
          }}>
            {stats?.cohortsAtRisk || 0}
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Progreso General de Cohortes</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '15px' }}>
            Progreso Promedio:
          </span>
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '8px',
            flex: 1,
            maxWidth: '300px'
          }}>
            <div style={{
              backgroundColor: '#28a745',
              height: '20px',
              borderRadius: '10px',
              width: `${stats?.averageCohortProgress || 0}%`,
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <span style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginLeft: '15px',
            color: '#28a745'
          }}>
            {stats?.averageCohortProgress || 0}%
          </span>
        </div>
        <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
          Promedio de completitud de entregas across todas las cohortes
        </p>
      </div>

      {/* Cohort Progress Chart */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Comparación entre Cohortes</h2>
        <CohortProgressChart
          data={cohortData?.chartData || []}
          loading={cohortLoading}
          error={cohortError}
        />
      </div>

      {/* Summary Stats from Chart Data */}
      {cohortData?.summary && !cohortLoading && (
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Métricas Globales</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                {cohortData.summary.totalSubmissions}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>Total de Entregas</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                {cohortData.summary.overallOnTimePercentage.toFixed(1)}%
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>Entregas a Tiempo</div>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745' }}>
                {cohortData.summary.bestPerformingCohort.replace('Cohorte ', '')}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>Mejor Cohorte</div>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#dc3545' }}>
                {cohortData.summary.worstPerformingCohort.replace('Cohorte ', '')}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>Requiere Atención</div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Milestones */}
      {stats?.upcomingMilestones && stats.upcomingMilestones.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Próximos Hitos Académicos</h2>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '15px'
            }}>
              {stats.upcomingMilestones.map((milestone, index) => (
                <div key={index} style={{
                  padding: '15px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                    🎯 {milestone.milestone}
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6c757d', fontSize: '14px' }}>
                      📅 {new Date(milestone.date).toLocaleDateString()}
                    </span>
                    <span style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {milestone.courses_affected} cursos afectados
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Management Actions */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Acciones de Coordinación</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          <button style={{
            backgroundColor: '#17a2b8',
            color: 'white',
            padding: '15px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            📊 Exportar Reporte Global
          </button>
          <button style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '15px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            👥 Gestionar Cohortes ({stats?.totalCohorts || 0})
          </button>
          <button style={{
            backgroundColor: '#ffc107',
            color: 'white',
            padding: '15px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            ⚠️ Intervenir Cohortes en Riesgo ({stats?.cohortsAtRisk || 0})
          </button>
          <button style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '15px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            🎓 Supervisar Profesores ({stats?.totalTeachers || 0})
          </button>
        </div>
      </div>

      {/* Access Level Notice */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#d1ecf1',
        borderRadius: '8px',
        border: '1px solid '#17a2b8''
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#0c5460' }}>
          📊 <strong>Acceso de Coordinación:</strong> Tienes acceso completo a todas las métricas
          y reportes de las cohortes bajo tu coordinación. Puedes ver el progreso de todos los
          estudiantes y profesores en tus programas asignados.
        </p>
      </div>
    </div>
  )
}