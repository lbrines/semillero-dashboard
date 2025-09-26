'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'

interface Course {
  id: string
  name: string
  description: string
  section: string
  room: string
  ownerId: string
  creationTime: string
  updateTime: string
  enrollmentCode: string
  courseState: string
  alternateLink: string
  teacherGroupEmail: string
  courseGroupEmail: string
  guardiansEnabled: boolean
  calendarId: string
  courseworkCount: number
  studentCount: number
}

interface CourseWithDetails extends Course {
  students: any[]
  averageCompletionRate: number
  studentsAtRisk: number
  averageGrade: number
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch courses
        const coursesResponse = await axios.get('http://localhost:8000/api/v1/courses')
        const coursesData = coursesResponse.data.courses || []

        // Fetch detailed data for each course
        const coursesWithDetails = await Promise.all(
          coursesData.map(async (course: Course) => {
            try {
              // Fetch students for this course
              const studentsResponse = await axios.get(`http://localhost:8000/api/v1/courses/${course.id}/students`)
              const students = studentsResponse.data.students || []
              
              // Calculate metrics
              const averageCompletionRate = students.length > 0 
                ? Math.round(students.reduce((sum: number, s: any) => sum + s.completionRate, 0) / students.length)
                : 0
              const studentsAtRisk = students.filter((s: any) => s.isAtRisk).length
              const averageGrade = students.length > 0 
                ? Math.round(students.reduce((sum: number, s: any) => sum + (s.averageGrade || 0), 0) / students.length)
                : 0

              return {
                ...course,
                students,
                averageCompletionRate,
                studentsAtRisk,
                averageGrade
              }
            } catch (err) {
              return {
                ...course,
                students: [],
                averageCompletionRate: 0,
                studentsAtRisk: 0,
                averageGrade: 0
              }
            }
          })
        )

        setCourses(coursesWithDetails)

      } catch (err) {
        setError('Error al cargar los cursos')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCoursesData()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>Cursos</h1>
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
          <span>Cargando cursos...</span>
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
        <h1>Cursos</h1>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p style={{ color: '#c33', margin: 0 }}>
            ❌ {error}
          </p>
          <div style={{ marginTop: '15px' }}>
            <Link 
              href="/"
              style={{
                padding: '8px 16px',
                backgroundColor: '#3498db',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                marginRight: '10px'
              }}
            >
              ← Volver al Dashboard
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
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
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Cursos</h1>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d' }}>
            Gestión y seguimiento de cursos académicos
          </p>
        </div>
        <Link 
          href="/" 
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          ← Volver al Dashboard
        </Link>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📚</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3498db', marginBottom: '5px' }}>
            {courses.length}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>Total Cursos</div>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745', marginBottom: '5px' }}>
            {courses.reduce((sum, course) => sum + course.students.length, 0)}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>Total Estudiantes</div>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📝</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffc107', marginBottom: '5px' }}>
            {courses.reduce((sum, course) => sum + course.courseworkCount, 0)}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>Total Tareas</div>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚠️</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc3545', marginBottom: '5px' }}>
            {courses.reduce((sum, course) => sum + course.studentsAtRisk, 0)}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>Estudiantes en Riesgo</div>
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📚</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>No hay cursos disponibles</h3>
          <p style={{ margin: 0, color: '#999' }}>
            No se encontraron cursos en el sistema.
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '25px'
        }}>
          {courses.map(course => (
            <div key={course.id} style={{ 
              padding: '25px', 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e9ecef'
            }}>
              {/* Course Header */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  color: '#2c3e50',
                  fontSize: '20px',
                  lineHeight: '1.3'
                }}>
                  {course.name}
                </h3>
                {course.description && (
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    color: '#666',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {course.description}
                  </p>
                )}
                <div style={{ 
                  display: 'flex', 
                  gap: '15px',
                  fontSize: '12px',
                  color: '#888'
                }}>
                  {course.section && (
                    <span>Sección: {course.section}</span>
                  )}
                  {course.room && (
                    <span>Aula: {course.room}</span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Progreso promedio:</span>
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    {course.averageCompletionRate}%
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '20px', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${course.averageCompletionRate}%`, 
                    height: '100%', 
                    backgroundColor: course.averageCompletionRate >= 70 ? '#28a745' : course.averageCompletionRate >= 50 ? '#ffc107' : '#dc3545',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3498db' }}>
                    {course.students.length}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>Estudiantes</div>
                </div>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffc107' }}>
                    {course.courseworkCount}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>Tareas</div>
                </div>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
                    {course.averageGrade > 0 ? course.averageGrade : 'N/A'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>Promedio</div>
                </div>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc3545' }}>
                    {course.studentsAtRisk}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>En Riesgo</div>
                </div>
              </div>

              {/* Course Details */}
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '6px',
                marginBottom: '20px'
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '10px',
                  fontSize: '12px'
                }}>
                  <div>
                    <strong>Estado:</strong> {course.courseState}
                  </div>
                  <div>
                    <strong>Código:</strong> {course.enrollmentCode}
                  </div>
                  <div>
                    <strong>Profesor:</strong> {course.teacherGroupEmail}
                  </div>
                  <div>
                    <strong>Creado:</strong> {new Date(course.creationTime).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <Link 
                  href={`/courses/${course.id}/students`}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  Ver Estudiantes
                </Link>
                <Link 
                  href={`/courses/${course.id}`}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* System Info */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e8f4f8', 
        borderRadius: '8px',
        border: '1px solid #bee5eb',
        marginTop: '40px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#0c5460' }}>Información del Sistema</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <strong>Total de cursos:</strong> {courses.length}
          </div>
          <div>
            <strong>Última actualización:</strong> {new Date().toLocaleString()}
          </div>
          <div>
            <strong>Modo de datos:</strong> Mock (Demo)
          </div>
        </div>
      </div>
    </div>
  )
}
