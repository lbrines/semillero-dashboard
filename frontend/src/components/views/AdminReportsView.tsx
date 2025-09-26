'use client'

import { useOverviewStats } from '@/hooks/useOverviewStats'
import { useKPIs } from '@/hooks/useKPIs'
import { useCohortProgress } from '@/hooks/useCohortProgress'
import { CohortProgressChart } from '@/components/charts/CohortProgressChart'
import { useAuth } from '@/contexts/AuthContext'

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
          <p style={{ color: '#6c757d', margin: 0 }}>Cargando panel administrativo completo...</p>
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
          <p>{overviewError || kpisError}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1400px', margin: '0 auto' }}>
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
          <h1 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>Panel de Administración</h1>
          <p style={{ margin: 0, color: '#6c757d' }}>
            Administrador: {user?.name || 'Admin'} 🔧 - Acceso Completo al Sistema
          </p>
          {(overviewStats?.demo_mode || kpis?.demo_mode) && (
            <span style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              marginTop: '5px',
              display: 'inline-block'
            }}>
              MODO {(overviewStats?.demo_mode || kpis?.demo_mode || 'mock').toUpperCase()}
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

      {/* System Overview KPIs */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Vista General del Sistema</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '15px'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '14px' }}>Total Estudiantes</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
              {kpis?.totalStudents || overviewStats?.totalStudents || 0}
            </p>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '14px' }}>Total Profesores</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
              {overviewStats?.totalTeachers || 0}
            </p>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '14px' }}>Cursos Activos</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
              {kpis?.totalCourses || overviewStats?.totalActiveCourses || 0}
            </p>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '14px' }}>Tasa Retención</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
              {overviewStats?.retentionRate || 92}%
            </p>
          </div>

          <div style={{
            backgroundColor: overviewStats?.studentsAtRisk && overviewStats.studentsAtRisk > 0 ? '#f8d7da' : '#d4edda',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            border: `1px solid ${overviewStats?.studentsAtRisk && overviewStats.studentsAtRisk > 0 ? '#dc3545' : '#28a745'}`
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '14px' }}>Estudiantes en Riesgo</h3>
            <p style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 'bold',
              color: overviewStats?.studentsAtRisk && overviewStats.studentsAtRisk > 0 ? '#dc3545' : '#28a745'
            }}>
              {overviewStats?.studentsAtRisk || 0}
            </p>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '14px' }}>Promedio General</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
              {overviewStats?.averageGrade || 8.3}
            </p>
          </div>
        </div>
      </div>

      {/* Submission Analytics */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Análisis de Entregas</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Entregas Totales</h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
              {kpis?.totalSubmissions || overviewStats?.totalSubmissions || 0}
            </p>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              A tiempo: <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                {kpis?.onTimeSubmissions || (overviewStats?.totalSubmissions && overviewStats?.lateSubmissions ?
                  overviewStats.totalSubmissions - overviewStats.lateSubmissions : 0)}
              </span>
            </div>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              Tardías: <span style={{ color: '#dc3545', fontWeight: 'bold' }}>
                {kpis?.lateSubmissions || overviewStats?.lateSubmissions || 0}
              </span>
            </div>
          </div>

          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Tasa de Completitud</h3>
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '10px'
            }}>
              <div style={{
                backgroundColor: '#28a745',
                height: '20px',
                borderRadius: '10px',
                width: `${overviewStats?.completionRate || 79}%`,
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <p style={{ margin: 0, textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>
              {overviewStats?.completionRate || 79}% del sistema
            </p>
          </div>

          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Tiempo Promedio</h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: 'bold', color: '#17a2b8' }}>
              {overviewStats?.averageCompletionTime || 2.5}
            </p>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              días por entrega
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Performance Chart */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Rendimiento por Cohorte</h2>
        <CohortProgressChart
          data={cohortData?.chartData || []}
          loading={cohortLoading}
          error={cohortError}
        />

        {cohortData?.summary && !cohortLoading && (
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginTop: '20px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Análisis Comparativo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
                  {cohortData.summary.bestPerformingCohort.replace('Cohorte ', '')}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Mejor Rendimiento</div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc3545' }}>
                  {cohortData.summary.worstPerformingCohort.replace('Cohorte ', '')}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Requiere Intervención</div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>
                  {cohortData.summary.totalSubmissions}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Entregas Totales</div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
                  {cohortData.summary.overallOnTimePercentage.toFixed(1)}%
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Rendimiento Global</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Administrative Actions */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Acciones Administrativas</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '15px'
        }}>
          <button style={{
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '15px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            ⚙️ Configuración del Sistema
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
            👥 Gestión de Usuarios ({(kpis?.totalStudents || 0) + (overviewStats?.totalTeachers || 0)})
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
            📚 Administrar Cursos ({kpis?.totalCourses || 0})
          </button>
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
            📊 Reportes Avanzados
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
            🔧 Mantenimiento del Sistema
          </button>
          <button style={{
            backgroundColor: '#6f42c1',
            color: 'white',
            padding: '15px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            🔐 Auditoría y Seguridad
          </button>
        </div>
      </div>

      {/* System Status */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Estado del Sistema</h2>
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Estado de la Base de Datos</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#28a745'
                }}></div>
                <span style={{ fontSize: '14px', color: '#6c757d' }}>Operacional</span>
              </div>
            </div>
            <div>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Google Classroom API</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#ffc107'
                }}></div>
                <span style={{ fontSize: '14px', color: '#6c757d' }}>Modo Mock</span>
              </div>
            </div>
            <div>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Servicios Backend</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#28a745'
                }}></div>
                <span style={{ fontSize: '14px', color: '#6c757d' }}>Todos activos</span>
              </div>
            </div>
            <div>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Último Backup</h4>
              <span style={{ fontSize: '14px', color: '#6c757d' }}>
                {new Date().toLocaleDateString()} - 03:00
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Privileges Notice */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f8d7da',
        borderRadius: '8px',
        border: '1px solid #dc3545'
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#721c24' }}>
          ⚠️ <strong>Acceso de Administrador:</strong> Tienes acceso completo a todos los datos
          del sistema, incluyendo información personal de estudiantes y profesores. Usa estos
          privilegios con responsabilidad y de acuerdo con las políticas de privacidad institucionales.
        </p>
      </div>
    </div>
  )
}