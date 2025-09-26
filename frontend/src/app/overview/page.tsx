'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRole } from '@/contexts/RoleContext'
import { RoleGuard } from '@/components/RoleGuard'

export default function OverviewPage() {
  const { user, logout } = useAuth()
  const { role, canSearchStudents, canViewAllReports, canManageUsers, canViewGlobalStats } = useRole()

  return (
    <RoleGuard requiredRole="administrador">
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
            <h1 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>Panel de Administración</h1>
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
            {canManageUsers && (
              <button 
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Gestionar Usuarios
              </button>
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

        {/* KPIs Globales */}
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
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Total Usuarios</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
              12
            </p>
          </div>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Estudiantes Activos</h3>
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
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Profesores</h3>
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
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Cursos Activos</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
              2
            </p>
          </div>
        </div>

        {/* Estadísticas Globales */}
        {canViewGlobalStats && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Estadísticas Globales</h2>
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
                gap: '20px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Tasa de Retención</h4>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>92%</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Satisfacción General</h4>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#17a2b8' }}>4.3/5</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Tiempo Promedio de Entrega</h4>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ffc107' }}>2.3 días</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Tasa de Completitud</h4>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#6f42c1' }}>79%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumen por Roles */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Resumen por Roles</h2>
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
              <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>👨‍🎓 Estudiantes</h3>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Total: 8</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Activos: 8</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Promedio general: 8.4</p>
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
                  ACTIVOS
                </span>
                <span style={{ fontSize: '12px', color: '#6c757d' }}>
                  100% activos
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
              <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>👨‍🏫 Profesores</h3>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Total: 2</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Activos: 2</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Cursos asignados: 2</p>
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
                  ACTIVOS
                </span>
                <span style={{ fontSize: '12px', color: '#6c757d' }}>
                  100% activos
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
              <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>👨‍💼 Coordinadores</h3>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Total: 1</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Activos: 1</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Cohortes supervisadas: 2</p>
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
                  100% activo
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
              <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>👨‍💻 Administradores</h3>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Total: 1</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Activos: 1</p>
                <p style={{ margin: '0 0 5px 0', color: '#495057' }}>Permisos: Completos</p>
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
                  100% activo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Actividad Reciente del Sistema</h2>
          <div style={{ 
            backgroundColor: '#fff', 
            borderRadius: '8px', 
            border: '1px solid #e0e0e0',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Usuario</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Acción</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Rol</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Fecha</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Juan Pérez</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Entregó tarea</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Estudiante</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>2024-01-26 14:30</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#d4edda', 
                      color: '#155724', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      EXITOSO
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>María Profesora</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Evaluó entrega</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Profesor</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>2024-01-26 16:45</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#d4edda', 
                      color: '#155724', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      EXITOSO
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Carlos Coordinador</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Generó reporte</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Coordinador</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>2024-01-26 18:20</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#d4edda', 
                      color: '#155724', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      EXITOSO
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Ana Administradora</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Acceso al sistema</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Administrador</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>2024-01-26 19:15</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#d4edda', 
                      color: '#155724', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      EXITOSO
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
