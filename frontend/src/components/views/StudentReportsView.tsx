'use client'

import { useStudentStats } from '@/hooks/useStudentStats'
import { useAuth } from '@/contexts/AuthContext'

export function StudentReportsView() {
  const { user, logout } = useAuth()
  const { stats, loading, error } = useStudentStats()

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
          <p style={{ color: '#6c757d', margin: 0 }}>Cargando tu progreso...</p>
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
          <h1 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>Mi Progreso Académico</h1>
          <p style={{ margin: 0, color: '#6c757d' }}>
            Hola {stats?.student_name || user?.name || 'Estudiante'} 👋
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

      {/* Personal Stats */}
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
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Mis Cursos</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {stats?.myCourses || 0}
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Entregas Completadas</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {stats?.completedSubmissions || 0}
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Promedio General</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
            {stats?.averageGrade || 0}
          </p>
        </div>

        <div style={{
          backgroundColor: stats?.isAtRisk ? '#f8d7da' : '#d4edda',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: `1px solid ${stats?.isAtRisk ? '#dc3545' : '#28a745'}`
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Estado Académico</h3>
          <p style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 'bold',
            color: stats?.isAtRisk ? '#dc3545' : '#28a745'
          }}>
            {stats?.isAtRisk ? '⚠️ Requiere Atención' : '✅ En Buen Estado'}
          </p>
        </div>
      </div>

      {/* Progress Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Completion Rate */}
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
              width: `${stats?.completionRate || 0}%`,
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <p style={{ margin: 0, textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>
            {stats?.completionRate || 0}% completado
          </p>
        </div>

        {/* Submission Status */}
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Estado de Entregas</h3>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#495057' }}>Completadas:</span>
            <span style={{ marginLeft: '10px', color: '#28a745' }}>
              {stats?.completedSubmissions || 0}
            </span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#495057' }}>Pendientes:</span>
            <span style={{ marginLeft: '10px', color: '#ffc107' }}>
              {stats?.pendingSubmissions || 0}
            </span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#495057' }}>Entregas Tardías:</span>
            <span style={{ marginLeft: '10px', color: '#dc3545' }}>
              {stats?.lateSubmissions || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Próximas Entregas</h2>
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
                    backgroundColor: deadline.days_remaining <= 2 ? '#dc3545' : '#ffc107',
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

      {/* Recent Activity */}
      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <div>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Actividad Reciente</h2>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {stats.recentActivity.map((activity, index) => (
              <div key={index} style={{
                padding: '15px',
                borderBottom: index < stats.recentActivity.length - 1 ? '1px solid #e0e0e0' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>
                    {activity.assignment_title}
                  </h4>
                  <p style={{ margin: '0 0 5px 0', color: '#6c757d', fontSize: '14px' }}>
                    {activity.course_name}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#28a745' }}>
                    {activity.status}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    backgroundColor: activity.activity_type === 'submission' ? '#007bff' : '#28a745',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {activity.activity_type === 'submission' ? 'Entrega' : 'Calificación'}
                  </span>
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                    {new Date(activity.activity_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        border: '1px solid #2196f3'
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#1976d2' }}>
          🔒 <strong>Privacidad:</strong> Solo puedes ver tu propio progreso académico.
          Los datos de otros estudiantes no son visibles desde tu cuenta.
        </p>
      </div>
    </div>
  )
}