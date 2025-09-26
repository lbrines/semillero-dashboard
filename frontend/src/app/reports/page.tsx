export default function ReportsPage() {
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
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Reportes Académicos</h1>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#7f8c8d' }}>Dashboard</a>
          <a href="/students" style={{ textDecoration: 'none', color: '#7f8c8d' }}>Estudiantes</a>
          <a href="/courses" style={{ textDecoration: 'none', color: '#7f8c8d' }}>Cursos</a>
          <a href="/reports" style={{ textDecoration: 'none', color: '#3498db', fontWeight: 'bold' }}>Reportes</a>
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
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Total Estudiantes</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            4
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
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
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
            4
          </p>
        </div>
      </div>

      {/* Progreso por Cohorte */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Progreso por Cohorte</h2>
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#495057' }}>
              Filtrar por Cohorte:
            </label>
            <select style={{ 
              padding: '8px 12px', 
              border: '1px solid #ced4da', 
              borderRadius: '4px',
              fontSize: '14px',
              minWidth: '200px'
            }}>
              <option value="">Todas las cohortes</option>
              <option value="cohort_1">Cohorte Ecommerce 2024-1</option>
              <option value="cohort_2">Cohorte Marketing 2024-1</option>
            </select>
          </div>
          
          {/* Gráfico de Barras Simple */}
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Progreso de Entregas por Cohorte</h3>
            <div style={{ display: 'flex', alignItems: 'end', gap: '20px', height: '200px' }}>
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
                  80%
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Ecommerce 2024-1</div>
                <div style={{ fontSize: '10px', color: '#6c757d' }}>8/10 entregas</div>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ 
                  backgroundColor: '#ffc107', 
                  height: '100px', 
                  marginBottom: '10px',
                  borderRadius: '4px 4px 0 0',
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  60%
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Marketing 2024-1</div>
                <div style={{ fontSize: '10px', color: '#6c757d' }}>6/10 entregas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detalle de Cohortes */}
      <div>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Detalle de Cohortes</h2>
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
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', color: '#495057' }}>Total Estudiantes:</span>
              <span style={{ marginLeft: '10px', color: '#007bff' }}>2</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', color: '#495057' }}>Entregas a Tiempo:</span>
              <span style={{ marginLeft: '10px', color: '#28a745' }}>8 (80%)</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', color: '#495057' }}>Entregas Tardías:</span>
              <span style={{ marginLeft: '10px', color: '#dc3545' }}>2 (20%)</span>
            </div>
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
              <span style={{ color: '#155724', fontSize: '14px' }}>✅ Cohorte en buen estado</span>
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
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', color: '#495057' }}>Total Estudiantes:</span>
              <span style={{ marginLeft: '10px', color: '#007bff' }}>2</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', color: '#495057' }}>Entregas a Tiempo:</span>
              <span style={{ marginLeft: '10px', color: '#28a745' }}>6 (60%)</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', color: '#495057' }}>Entregas Tardías:</span>
              <span style={{ marginLeft: '10px', color: '#dc3545' }}>4 (40%)</span>
            </div>
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
              <span style={{ color: '#856404', fontSize: '14px' }}>⚠️ Cohorte requiere atención</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}