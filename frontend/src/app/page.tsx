export default function Dashboard() {
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
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Semillero Dashboard</h1>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#3498db', fontWeight: 'bold' }}>Dashboard</a>
          <a href="/students" style={{ textDecoration: 'none', color: '#7f8c8d' }}>Estudiantes</a>
          <a href="/courses" style={{ textDecoration: 'none', color: '#7f8c8d' }}>Cursos</a>
          <a href="/reports" style={{ textDecoration: 'none', color: '#7f8c8d' }}>Reportes</a>
        </nav>
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
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Total Cursos</h3>
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
            3
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
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Entregas Tardías</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
            2
          </p>
        </div>
      </div>

      {/* Cursos */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Cursos Activos</h2>
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
            <p style={{ margin: '0 0 15px 0', color: '#495057' }}>Curso completo de especialización en comercio electrónico</p>
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
                ACTIVE
              </span>
              <span style={{ 
                padding: '4px 8px', 
                backgroundColor: '#e2e3e5', 
                color: '#383d41', 
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                ECOMM2024
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
            <p style={{ margin: '0 0 15px 0', color: '#495057' }}>Curso completo de especialización en marketing digital</p>
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
                ACTIVE
              </span>
              <span style={{ 
                padding: '4px 8px', 
                backgroundColor: '#e2e3e5', 
                color: '#383d41', 
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                MKT2024
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Estudiantes */}
      <div>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Estudiantes</h2>
        <div style={{ 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          border: '1px solid #e0e0e0',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Nombre</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Curso</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Juan Pérez</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>juan.perez@example.com</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Especialista en Ecommerce</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    backgroundColor: '#d4edda', 
                    color: '#155724', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    ACTIVE
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>María García</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>maria.garcia@example.com</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Especialista en Ecommerce</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    backgroundColor: '#d4edda', 
                    color: '#155724', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    ACTIVE
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Carlos López</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>carlos.lopez@example.com</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>Especialista en Marketing Digital</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    backgroundColor: '#d4edda', 
                    color: '#155724', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    ACTIVE
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}