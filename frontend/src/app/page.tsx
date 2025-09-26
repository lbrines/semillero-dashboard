'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Course {
  id: string
  name: string
  section: string
  description: string
  courseState: string
  enrollmentCode: string
}

interface Student {
  user_id: string
  profile: {
    name: {
      given_name: string
      family_name: string
    }
    email_address: string
  }
  course_id: string
  courseName: string
}

interface KPIs {
  totalStudents: number
  totalCourses: number
  totalSubmissions: number
  lateSubmissions: number
  studentsAtRisk: number
  averageCompletionRate: number
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const mockCourses = [
        {
          id: "course_1",
          name: "Especialista en Ecommerce",
          section: "Cohorte 2024-1",
          description: "Curso completo de especialización en comercio electrónico",
          courseState: "ACTIVE",
          enrollmentCode: "ECOMM2024"
        },
        {
          id: "course_2", 
          name: "Especialista en Marketing Digital",
          section: "Cohorte 2024-1",
          description: "Curso completo de especialización en marketing digital",
          courseState: "ACTIVE",
          enrollmentCode: "MARKET2024"
        }
      ]

      const mockStudents = [
        {
          user_id: "student_1",
          profile: {
            name: {
              given_name: "Juan",
              family_name: "Pérez"
            },
            email_address: "juan.perez@estudiante.edu"
          },
          course_id: "course_1",
          courseName: "Especialista en Ecommerce"
        },
        {
          user_id: "student_2",
          profile: {
            name: {
              given_name: "María",
              family_name: "García"
            },
            email_address: "maria.garcia@estudiante.edu"
          },
          course_id: "course_1",
          courseName: "Especialista en Ecommerce"
        }
      ]

      const mockKPIs = {
        totalStudents: 4,
        totalCourses: 2,
        totalSubmissions: 8,
        lateSubmissions: 2,
        studentsAtRisk: 1,
        averageCompletionRate: 75.5
      }

      setCourses(mockCourses)
      setStudents(mockStudents)
      setKpis(mockKPIs)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>Semillero Dashboard</h1>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '10px',
          marginTop: '20px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span>Cargando datos del dashboard...</span>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>Semillero Dashboard</h1>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p style={{ color: '#c33', margin: 0 }}>❌ {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
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
        borderBottom: '2px solid #eee'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Semillero Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d' }}>Panel de control académico</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <nav style={{ display: 'flex', gap: '15px' }}>
            <a href="/" style={{ color: '#2c3e50', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard</a>
            <a href="/students" style={{ color: '#7f8c8d', textDecoration: 'none' }}>Estudiantes</a>
            <a href="/courses" style={{ color: '#7f8c8d', textDecoration: 'none' }}>Cursos</a>
            <a href="/reports" style={{ color: '#7f8c8d', textDecoration: 'none' }}>Reportes</a>
          </nav>
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#e8f4f8',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2980b9'
          }}>
            MODO MOCK
          </div>
        </div>
      </div>

      {/* KPIs Section */}
      {kpis && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Métricas Generales</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px' 
          }}>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#3498db', 
              color: 'white', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>{kpis.totalStudents}</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>Total Estudiantes</p>
            </div>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#2ecc71', 
              color: 'white', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>{kpis.totalCourses}</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>Total Cursos</p>
            </div>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f39c12', 
              color: 'white', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>{kpis.totalSubmissions}</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>Total Entregas</p>
            </div>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#e74c3c', 
              color: 'white', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>{kpis.studentsAtRisk}</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>Estudiantes en Riesgo</p>
            </div>
          </div>
        </div>
      )}

      {/* Courses Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Cursos Disponibles ({courses.length})</h2>
        {courses.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '2px dashed #dee2e6'
          }}>
            <p style={{ color: '#6c757d', margin: 0 }}>No hay cursos disponibles</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {courses.map((course) => (
              <div 
                key={course.id} 
                style={{ 
                  border: '1px solid #e1e8ed', 
                  padding: '20px', 
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>{course.name}</h3>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Sección:</strong> {course.section}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Descripción:</strong> {course.description}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Estado:</strong> 
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginLeft: '8px',
                    backgroundColor: course.courseState === 'ACTIVE' ? '#d4edda' : '#f8d7da',
                    color: course.courseState === 'ACTIVE' ? '#155724' : '#721c24',
                    fontSize: '12px'
                  }}>
                    {course.courseState}
                  </span>
                </div>
                <div>
                  <strong>Código:</strong> {course.enrollmentCode}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Students Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Estudiantes ({students.length})</h2>
        {students.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '2px dashed #dee2e6'
          }}>
            <p style={{ color: '#6c757d', margin: 0 }}>No hay estudiantes registrados</p>
          </div>
        ) : (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Nombre</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Curso</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.user_id} style={{ borderBottom: '1px solid #f1f3f4' }}>
                    <td style={{ padding: '15px' }}>
                      {student.profile.name.given_name} {student.profile.name.family_name}
                    </td>
                    <td style={{ padding: '15px' }}>{student.profile.email_address}</td>
                    <td style={{ padding: '15px' }}>{student.courseName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* System Info */}
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#e8f4f8', 
        borderRadius: '8px',
        border: '1px solid #bee5eb'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#0c5460' }}>Información del Sistema</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <strong>Modo:</strong> Mock (Datos de prueba)
          </div>
          <div>
            <strong>Backend:</strong> <a href="http://localhost:8000" target="_blank" style={{ color: '#2980b9' }}>http://localhost:8000</a>
          </div>
          <div>
            <strong>Frontend:</strong> <a href="http://localhost:3000" target="_blank" style={{ color: '#2980b9' }}>http://localhost:3000</a>
          </div>
          <div>
            <strong>API Docs:</strong> <a href="http://localhost:8000/docs" target="_blank" style={{ color: '#2980b9' }}>Ver Documentación</a>
          </div>
        </div>
      </div>
    </div>
  )
}