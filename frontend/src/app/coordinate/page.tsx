'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRole } from '@/contexts/RoleContext'
import { RoleGuard } from '@/components/RoleGuard'
import { useCoordinatorStats } from '@/hooks/useCoordinatorStats'

export default function CoordinatePage() {
  const { user, logout } = useAuth()
  const { role, canSearchStudents, canViewAllReports } = useRole()
  const { stats, loading, error } = useCoordinatorStats()

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
          <p style={{ color: '#6c757d', margin: 0 }}>Cargando estadísticas del coordinador...</p>
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
    <RoleGuard requiredRole="coordinador">
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
            <h1 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>Panel del Coordinador</h1>
            <p style={{ margin: 0, color: '#6c757d' }}>Bienvenido, {user?.name}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {canSearchStudents && (
              <a 
                href="/students" 
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                Buscar Estudiantes
              </a>
            )}
            {canViewAllReports && (
              <a 
                href="/reports" 
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                Ver Reportes
              </a>
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

        {/* KPIs del Coordinador */}
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
              2
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
              8
            </p>
          </div>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Profesores Activos</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
              2
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
              8.4
            </p>
          </div>
        </div>

        {/* Comparación entre Cohortes */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Comparación entre Cohortes</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '20px' 
          }}>
            <div style={{ 
              backgroundColor: '#fff', 
              padding: '20px', 
              borderRadius: '8px', 
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Cohorte Ecommerce 2024-1</h3>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Estudiantes: 4</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Entregas completadas: 20/24 (83%)</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Promedio: 8.7</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Entregas a tiempo: 18/20 (90%)</p>
              </div>
              <div style={{ 
                width: '100%', 
                backgroundColor: '#e9ecef', 
                borderRadius: '4px', 
                height: '8px',
                marginBottom: '10px'
              }}>
                <div style={{ 
                  width: '83%', 
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
                  EXCELENTE
                </span>
                <span style={{ fontSize: '12px', color: '#6c757d' }}>
                  83% completado
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
              <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Cohorte Marketing 2024-1</h3>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Estudiantes: 4</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Entregas completadas: 15/20 (75%)</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Promedio: 8.1</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Entregas a tiempo: 12/15 (80%)</p>
              </div>
              <div style={{ 
                width: '100%', 
                backgroundColor: '#e9ecef', 
                borderRadius: '4px', 
                height: '8px',
                marginBottom: '10px'
              }}>
                <div style={{ 
                  width: '75%', 
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
                  BUENO
                </span>
                <span style={{ fontSize: '12px', color: '#6c757d' }}>
                  75% completado
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reportes Globales */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Reportes Globales</h2>
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '20px', 
            borderRadius: '8px', 
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Tasa de Completitud</h4>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>{stats?.completionRate || 0}%</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Tasa de Puntualidad</h4>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#17a2b8' }}>{stats?.punctualityRate || 0}%</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Satisfacción Estudiantil</h4>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ffc107' }}>4.2/5</p>
              </div>
            </div>
            
            {/* Gráfico de Barras Simple */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Progreso por Cohorte</h4>
              <div style={{ display: 'flex', alignItems: 'end', gap: '20px', height: '150px' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ 
                    backgroundColor: '#28a745', 
                    height: '120px', 
                    marginBottom: '10px',
                    borderRadius: '4px 4px 0 0',
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    83%
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>Ecommerce</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ 
                    backgroundColor: '#ffc107', 
                    height: '90px', 
                    marginBottom: '10px',
                    borderRadius: '4px 4px 0 0',
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    75%
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>Marketing</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estudiantes por Cohorte */}
        <div>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Estudiantes por Cohorte</h2>
          <div style={{ 
            backgroundColor: '#fff', 
            borderRadius: '8px', 
            border: '1px solid #e0e0e0',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Estudiante</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Cohorte</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Progreso</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Promedio</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>{stats?.studentProgress[0]?.name || 'Juan Pérez'}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>{stats?.studentProgress[0]?.course || 'Ecommerce 2024-1'}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>{stats?.studentProgress[0]?.completionRate || 80}%</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>{stats?.studentProgress[0]?.averageGrade || 9.2}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#d4edda', 
                      color: '#155724', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      EXCELENTE
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>María García</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Ecommerce 2024-1</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>60%</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>8.5</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#d1ecf1', 
                      color: '#0c5460', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      BUENO
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Carlos López</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Marketing 2024-1</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>67%</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>7.8</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#fff3cd', 
                      color: '#856404', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      EN PROGRESO
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Ana Martínez</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Marketing 2024-1</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>100%</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>8.9</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#d4edda', 
                      color: '#155724', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      COMPLETADO
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
