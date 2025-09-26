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
        borderBottom: '2px solid #e9ecef'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            color: '#2c3e50', 
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            Reportes de Coordinación
          </h1>
          <p style={{ 
            margin: '5px 0 0 0', 
            color: '#6c757d', 
            fontSize: '16px' 
          }}>
            Análisis global del rendimiento académico
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ 
            color: '#6c757d', 
            fontSize: '14px' 
          }}>
            {user?.name || 'Usuario'}
          </span>
          {stats?.demo_mode && (
            <span style={{
              backgroundColor: '#ffc107',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              MODO {stats.demo_mode.toUpperCase()}
            </span>
          )}
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
      </div>

      {/* KPIs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            margin: '0 0 10px 0', 
            color: '#2c3e50', 
            fontSize: '18px' 
          }}>
            Tasa de Completitud
          </h3>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#28a745' 
          }}>
            {stats?.completionRate || 0}%
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            margin: '0 0 10px 0', 
            color: '#2c3e50', 
            fontSize: '18px' 
          }}>
            Tasa de Puntualidad
          </h3>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#17a2b8' 
          }}>
            {stats?.punctualityRate || 0}%
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            margin: '0 0 10px 0', 
            color: '#2c3e50', 
            fontSize: '18px' 
          }}>
            Total Estudiantes
          </h3>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#6f42c1' 
          }}>
            {stats?.totalStudents || 0}
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            margin: '0 0 10px 0', 
            color: '#2c3e50', 
            fontSize: '18px' 
          }}>
            Estudiantes en Riesgo
          </h3>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#dc3545' 
          }}>
            {stats?.studentsAtRisk || 0}
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        marginBottom: '30px'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          color: '#2c3e50', 
          fontSize: '20px' 
        }}>
          Progreso de Cohorte
        </h3>
        {cohortLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#6c757d' }}>Cargando datos de progreso...</p>
          </div>
        ) : cohortError ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#dc3545' }}>Error al cargar datos de progreso</p>
          </div>
        ) : (
          <CohortProgressChart data={cohortData?.chartData || []} />
        )}
      </div>

      {/* Student Progress Table */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          color: '#2c3e50', 
          fontSize: '20px' 
        }}>
          Progreso de Estudiantes
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#e9ecef' }}>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  Estudiante
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  Curso
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  Completitud
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  Promedio
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {stats?.studentProgress?.map((student, index) => (
                <tr key={index} style={{ 
                  borderBottom: '1px solid #dee2e6'
                }}>
                  <td style={{ padding: '12px', color: '#2c3e50' }}>
                    {student.name}
                  </td>
                  <td style={{ padding: '12px', color: '#6c757d' }}>
                    {student.course}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#e9ecef',
                      color: '#2c3e50',
                      fontSize: '14px'
                    }}>
                      {student.completionRate}%
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#e9ecef',
                      color: '#2c3e50',
                      fontSize: '14px'
                    }}>
                      {student.averageGrade}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: 
                        student.status === 'excellent' ? '#d4edda' :
                        student.status === 'on-track' ? '#d1ecf1' : '#f8d7da',
                      color: 
                        student.status === 'excellent' ? '#155724' :
                        student.status === 'on-track' ? '#0c5460' : '#721c24'
                    }}>
                      {student.status === 'excellent' ? 'Excelente' :
                       student.status === 'on-track' ? 'En Progreso' : 'En Riesgo'}
                    </span>
                  </td>
                </tr>
              )) || []}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
