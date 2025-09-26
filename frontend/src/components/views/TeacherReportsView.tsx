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
          <p style={{ color: '#6c757d', margin: 0 }}>Cargando reportes de profesor...</p>
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
          <h1 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>Reportes de Profesor</h1>
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

      {/* KPIs */}
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
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Total Profesores</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {stats?.totalTeachers || 0}
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
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {stats?.activeTeachers || 0}
          </p>
        </div>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Total Cursos</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
            {stats?.totalCourses || 0}
          </p>
        </div>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Promedio de Estudiantes</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
            {stats?.averageStudentsPerTeacher || 0}
          </p>
        </div>
      </div>

      {/* Mis Estudiantes */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Mis Estudiantes</h2>
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
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
                <tr>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>
                    Juan Pérez
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
                          backgroundColor: '#28a745',
                          height: '8px',
                          borderRadius: '8px',
                          width: '85%',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '12px' }}>85%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                    8.5
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: '#d4edda',
                      color: '#155724',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      ✅ Buen Estado
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>
                    María García
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
                          backgroundColor: '#ffc107',
                          height: '8px',
                          borderRadius: '8px',
                          width: '72%',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '12px' }}>72%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                    7.2
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: '#d4edda',
                      color: '#155724',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      ✅ Buen Estado
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>
                    Carlos López
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
                          backgroundColor: '#dc3545',
                          height: '8px',
                          borderRadius: '8px',
                          width: '45%',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '12px' }}>45%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                    6.8
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      ⚠️ Requiere Atención
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fechas Límite */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Fechas Límite de Mis Clases</h2>
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            padding: '15px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>
                Proyecto Final - Ecommerce
              </h4>
              <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
                Especialista en Ecommerce
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>
                2 días restantes
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>
                2024-01-28
              </p>
            </div>
          </div>
          <div style={{
            padding: '15px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>
                Análisis de Competencia
              </h4>
              <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
                Especialista en Marketing Digital
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>
                5 días restantes
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>
                2024-01-31
              </p>
            </div>
          </div>
          <div style={{
            padding: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>
                Estrategia de Precios
              </h4>
              <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
                Especialista en Ecommerce
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>
                7 días restantes
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>
                2024-02-02
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Acciones Rápidas</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px' 
        }}>
          <button style={{
            padding: '20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Ver Todos los Estudiantes
          </button>
          <button style={{
            padding: '20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Crear Nueva Tarea
          </button>
          <button style={{
            padding: '20px',
            backgroundColor: '#ffc107',
            color: '#212529',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Calificar Entregas
          </button>
          <button style={{
            padding: '20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  )
}