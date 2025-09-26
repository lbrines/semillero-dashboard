'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRole } from '@/contexts/RoleContext'
import { RoleGuard } from '@/components/RoleGuard'
import { useTeacherStats } from '@/hooks/useTeacherStats'

export default function TeacherPage() {
  const { user, logout } = useAuth()
  const { role, canSearchStudents } = useRole()
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
          <p style={{ color: '#6c757d', margin: 0 }}>Cargando estadísticas del profesor...</p>
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
    <RoleGuard requiredRole="docente">
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
            <h1 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>Panel del Profesor</h1>
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

        {/* KPIs del Profesor */}
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
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Entregas Evaluadas</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
              24
            </p>
          </div>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Promedio de Calificaciones</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
              8.5
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
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Estudiantes: 4</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Entregas pendientes: 2</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Promedio del curso: 8.7</p>
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
                  12/14 entregas evaluadas
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
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Estudiantes: 4</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Entregas pendientes: 3</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Promedio del curso: 8.3</p>
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
                  9/12 entregas evaluadas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mis Estudiantes */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Mis Estudiantes</h2>
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
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Curso</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Entregas</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Promedio</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Juan Pérez</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Ecommerce</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>4/5</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>9.2</td>
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
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Ecommerce</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>3/5</td>
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
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Marketing</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>2/3</td>
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
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Marketing</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>3/3</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>8.9</td>
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
              </tbody>
            </table>
          </div>
        </div>

        {/* Entregas Pendientes */}
        <div>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Entregas Pendientes de Evaluación</h2>
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
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Tarea</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Curso</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Fecha Entrega</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Juan Pérez</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Proyecto Final</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Ecommerce</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>2024-01-28</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <button style={{
                      padding: '4px 8px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>
                      Evaluar
                    </button>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>María García</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Análisis de Mercado</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Ecommerce</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>2024-01-30</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <button style={{
                      padding: '4px 8px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>
                      Evaluar
                    </button>
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
