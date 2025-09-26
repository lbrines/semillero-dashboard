'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRole } from '@/contexts/RoleContext'
import { RoleGuard } from '@/components/RoleGuard'
import { useStudentStats } from '@/hooks/useStudentStats'

export default function StudentsPage() {
  const { user, logout } = useAuth()
  const { role } = useRole()
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
          <p style={{ color: '#6c757d', margin: 0 }}>Cargando estadísticas...</p>
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
    <RoleGuard requiredRole="estudiante">
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
            <p style={{ margin: 0, color: '#6c757d' }}>Bienvenido, {user?.name}</p>
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

        {/* KPIs Personales */}
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
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Entregas a Tiempo</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
              {(stats?.completedSubmissions || 0) - (stats?.lateSubmissions || 0)}
            </p>
          </div>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Entregas Tardías</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
              {stats?.lateSubmissions || 0}
            </p>
          </div>
        </div>

        {/* Mis Cursos */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Mis Cursos</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            <div style={{ 
              backgroundColor: '#fff', 
              padding: '20px', 
              borderRadius: '8px', 
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Especialista en Ecommerce</h3>
              <p style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>Cohorte 2024-1</p>
              <p style={{ margin: '0 0 15px 0', color: '#495057' }}>Progreso: {stats?.completionRate || 0}% completado</p>
              <div style={{ 
                width: '100%', 
                backgroundColor: '#e9ecef', 
                borderRadius: '4px', 
                height: '8px',
                marginBottom: '10px'
              }}>
                <div style={{ 
                  width: `${stats?.completionRate || 0}%`, 
                  backgroundColor: '#28a745', 
                  height: '8px', 
                  borderRadius: '4px' 
                }}></div>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ 
                  padding: '4px 8px', 
                  backgroundColor: '#d4edda', 
                  color: '#155724', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  ACTIVO
                </span>
                <span style={{ fontSize: '12px', color: '#6c757d' }}>
                  4/5 entregas completadas
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
              <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Especialista en Marketing Digital</h3>
              <p style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>Cohorte 2024-1</p>
              <p style={{ margin: '0 0 15px 0', color: '#495057' }}>Progreso: 60% completado</p>
              <div style={{ 
                width: '100%', 
                backgroundColor: '#e9ecef', 
                borderRadius: '4px', 
                height: '8px',
                marginBottom: '10px'
              }}>
                <div style={{ 
                  width: '60%', 
                  backgroundColor: '#ffc107', 
                  height: '8px', 
                  borderRadius: '4px' 
                }}></div>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ 
                  padding: '4px 8px', 
                  backgroundColor: '#fff3cd', 
                  color: '#856404', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  EN PROGRESO
                </span>
                <span style={{ fontSize: '12px', color: '#6c757d' }}>
                  3/5 entregas completadas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mis Entregas Recientes */}
        <div>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Mis Entregas Recientes</h2>
          <div style={{ 
            backgroundColor: '#fff', 
            borderRadius: '8px', 
            border: '1px solid #e0e0e0',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Curso</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Tarea</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Fecha Entrega</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Ecommerce</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Análisis de Competencia</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>2024-01-15</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#d4edda', 
                      color: '#155724', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      ENTREGADO A TIEMPO
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Marketing</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Campaña Digital</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>2024-01-20</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#f8d7da', 
                      color: '#721c24', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      ENTREGADO TARDÍO
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Ecommerce</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Estrategia de Precios</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>2024-01-25</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#d4edda', 
                      color: '#155724', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      ENTREGADO A TIEMPO
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}