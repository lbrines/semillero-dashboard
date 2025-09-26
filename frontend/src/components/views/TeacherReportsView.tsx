'use client'

import { useTeacherStats } from '@/hooks/useTeacherStats'
import { useAuth } from '@/contexts/AuthContext'

export function TeacherReportsView() {
  const { user, logout } = useAuth()
  const { stats, loading, error } = useTeacherStats()

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
          <p style={{ color: '#6c757d', margin: 0 }}>Cargando datos de tus clases...</p>
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
          <h1 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>Mis Clases y Estudiantes</h1>
          <p style={{ margin: 0, color: '#6c757d' }}>
            Bienvenido/a {stats?.teacher_name || user?.name || 'Profesor/a'} 👨‍🏫
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

      {/* Teacher Stats */}
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
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Mis Clases</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {stats?.myClasses || 0}
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Mis Estudiantes</h3>
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
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Pendiente Calificar</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
            {stats?.pendingGrading || 0}
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Promedio de Clase</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
            {stats?.averageClassGrade || 0}
          </p>
        </div>
      </div>

      {/* Student Progress Table */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Progreso de Mis Estudiantes</h2>
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {stats?.studentProgress && stats.studentProgress.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>
                      Estudiante
                    </th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>
                      Completitud
                    </th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>
                      Promedio
                    </th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.studentProgress.map((student, index) => (
                    <tr key={index} style={{
                      borderBottom: index < stats.studentProgress.length - 1 ? '1px solid #e0e0e0' : 'none'
                    }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>
                        {student.student_name}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            width: '100px',
                            height: '8px',
                            marginRight: '10px'
                          }}>
                            <div style={{
                              backgroundColor: student.completion_rate >= 80 ? '#28a745' :
                                             student.completion_rate >= 60 ? '#ffc107' : '#dc3545',
                              height: '8px',
                              borderRadius: '8px',
                              width: `${student.completion_rate}%`,
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                          <span style={{ fontSize: '12px' }}>{student.completion_rate}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                        {student.average_grade}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: student.status === 'En buen estado' ? '#d4edda' : '#f8d7da',
                          color: student.status === 'En buen estado' ? '#155724' : '#721c24',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {student.status === 'En buen estado' ? '✅ Buen Estado' : '⚠️ Requiere Atención'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
              <p>No hay datos de estudiantes disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Fechas Límite de Mis Clases</h2>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {stats.upcomingDeadlines.map((deadline, index) => (
              <div key={index} style={{
                padding: '15px',
                borderBottom: index < stats.upcomingDeadlines.length - 1 ? '1px solid #e0e0e0' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>
                    {deadline.assignment_title}
                  </h4>
                  <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
                    {deadline.course_name}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    backgroundColor: deadline.days_remaining <= 2 ? '#dc3545' : '#007bff',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '5px'
                  }}>
                    {deadline.days_remaining} días restantes
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>
                    {new Date(deadline.due_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Acciones Rápidas</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
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
            📝 Calificar Entregas ({stats?.pendingGrading || 0})
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
            👥 Ver Mis Estudiantes ({stats?.totalStudents || 0})
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
            📊 Exportar Reportes
          </button>
        </div>
      </div>

      {/* Access Notice */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffc107'
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
          👨‍🏫 <strong>Acceso Limitado:</strong> Solo puedes ver el progreso de los estudiantes
          en tus clases asignadas. Para acceder a datos globales, contacta al coordinador académico.
        </p>
      </div>
    </div>
  )
}