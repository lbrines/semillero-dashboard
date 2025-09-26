'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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

interface Student {
  userId: string
  profile: {
    name: {
      givenName: string
      familyName: string
    }
    emailAddress: string
  }
  courseId: string
  courseName: string
  completionRate: number
  averageGrade: number
  isAtRisk: boolean
  totalAssignments: number
  completedAssignments: number
  lateSubmissions: number
  onTimeSubmissions: number
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch course details
        const courseResponse = await axios.get(`http://localhost:8000/api/v1/courses/${courseId}`)
        setCourse(courseResponse.data)

        // Fetch students for this course
        const studentsResponse = await axios.get(`http://localhost:8000/api/v1/courses/${courseId}/students`)
        const studentsData = studentsResponse.data.students || []
        
        // Fetch detailed progress for each student
        const studentsWithProgress = await Promise.all(
          studentsData.map(async (student: any) => {
            try {
              const progressResponse = await axios.get(`http://localhost:8000/api/v1/students/${student.userId}/progress`)
              const progress = progressResponse.data
              
              return {
                ...student,
                ...progress
              }
            } catch (err) {
              return {
                ...student,
                completionRate: 0,
                averageGrade: 0,
                isAtRisk: true,
                totalAssignments: 0,
                completedAssignments: 0,
                lateSubmissions: 0,
                onTimeSubmissions: 0
              }
            }
          })
        )
        
        setStudents(studentsWithProgress)

      } catch (err) {
        setError('Error al cargar los datos del curso')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourseData()
    }
  }, [courseId])

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>Detalles del Curso</h1>
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
          <span>Cargando detalles del curso...</span>
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

  if (error || !course) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>Detalles del Curso</h1>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p style={{ color: '#c33', margin: 0 }}>
            ❌ {error || 'Curso no encontrado'}
          </p>
          <div style={{ marginTop: '15px' }}>
            <Link 
              href="/courses"
              style={{
                padding: '8px 16px',
                backgroundColor: '#3498db',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                marginRight: '10px'
              }}
            >
              ← Volver a Cursos
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

  // Calculate course statistics
  const totalStudents = students.length
  const studentsAtRisk = students.filter(s => s.isAtRisk).length
  const averageCompletionRate = students.length > 0 
    ? Math.round(students.reduce((sum, s) => sum + s.completionRate, 0) / students.length)
    : 0
  const averageGrade = students.length > 0 
    ? Math.round(students.reduce((sum, s) => sum + (s.averageGrade || 0), 0) / students.length)
    : 0
  const totalAssignments = students.reduce((sum, s) => sum + s.totalAssignments, 0)
  const completedAssignments = students.reduce((sum, s) => sum + s.completedAssignments, 0)
  const lateSubmissions = students.reduce((sum, s) => sum + s.lateSubmissions, 0)

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
          <h1 style={{ margin: 0, color: '#2c3e50' }}>{course.name}</h1>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d' }}>
            Detalles y seguimiento del curso
          </p>
        </div>
        <Link 
          href="/courses" 
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          ← Volver a Cursos
        </Link>
      </div>

      {/* Course Info */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px',
        marginBottom: '40px'
      }}>
        {/* Basic Info */}
        <div style={{ 
          padding: '25px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '20px' }}>Información del Curso</h2>
          <div style={{ marginBottom: '15px' }}>
            <strong>Nombre:</strong><br />
            {course.name}
          </div>
          {course.description && (
            <div style={{ marginBottom: '15px' }}>
              <strong>Descripción:</strong><br />
              {course.description}
            </div>
          )}
          <div style={{ marginBottom: '15px' }}>
            <strong>Sección:</strong> {course.section || 'N/A'}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Aula:</strong> {course.room || 'N/A'}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Código de inscripción:</strong><br />
            <code style={{ 
              padding: '4px 8px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {course.enrollmentCode}
            </code>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Estado:</strong> {course.courseState}
          </div>
          <div>
            <strong>Profesor:</strong> {course.teacherGroupEmail}
          </div>
        </div>

        {/* Course Statistics */}
        <div style={{ 
          padding: '25px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '20px' }}>Estadísticas del Curso</h2>
          
          {/* Overall Progress */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span><strong>Progreso promedio:</strong></span>
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {averageCompletionRate}%
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
                width: `${averageCompletionRate}%`, 
                height: '100%', 
                backgroundColor: averageCompletionRate >= 70 ? '#28a745' : averageCompletionRate >= 50 ? '#ffc107' : '#dc3545',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '15px'
          }}>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
                {totalStudents}
              </div>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                Estudiantes
              </div>
            </div>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                {course.courseworkCount}
              </div>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                Tareas
              </div>
            </div>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                {averageGrade > 0 ? averageGrade : 'N/A'}
              </div>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                Promedio
              </div>
            </div>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                {studentsAtRisk}
              </div>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                En Riesgo
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: studentsAtRisk > totalStudents * 0.3 ? '#f8d7da' : '#d4edda',
              color: studentsAtRisk > totalStudents * 0.3 ? '#721c24' : '#155724'
            }}>
              {studentsAtRisk > totalStudents * 0.3 ? '⚠️ Curso en Riesgo' : '✅ Curso Saludable'}
            </span>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div style={{ 
        padding: '25px', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '40px'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '20px' }}>
          Estudiantes ({totalStudents})
        </h2>
        
        {students.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#666'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
            <h3 style={{ margin: '0 0 10px 0' }}>No hay estudiantes inscritos</h3>
            <p style={{ margin: 0 }}>
              Este curso no tiene estudiantes inscritos actualmente.
            </p>
          </div>
        ) : (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', 
              gap: '15px',
              padding: '15px 20px',
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #dee2e6',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              <div>Estudiante</div>
              <div>Progreso</div>
              <div>Promedio</div>
              <div>Completadas</div>
              <div>Tardías</div>
              <div>Estado</div>
            </div>
            
            {students.map(student => (
              <div key={student.userId} style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', 
                gap: '15px',
                padding: '15px 20px',
                borderBottom: '1px solid #f1f3f4',
                alignItems: 'center'
              }}>
                <div>
                  <Link 
                    href={`/students/${student.userId}`}
                    style={{ 
                      color: '#3498db', 
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    {student.profile.name.givenName} {student.profile.name.familyName}
                  </Link>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {student.profile.emailAddress}
                  </div>
                </div>
                <div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                      {student.completionRate}%
                    </span>
                    <div style={{ 
                      width: '40px', 
                      height: '8px', 
                      backgroundColor: '#e9ecef', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: `${student.completionRate}%`, 
                        height: '100%', 
                        backgroundColor: student.completionRate >= 70 ? '#28a745' : student.completionRate >= 50 ? '#ffc107' : '#dc3545'
                      }}></div>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {student.averageGrade > 0 ? student.averageGrade : 'N/A'}
                </div>
                <div style={{ fontSize: '14px' }}>
                  {student.completedAssignments}/{student.totalAssignments}
                </div>
                <div style={{ fontSize: '14px', color: '#dc3545' }}>
                  {student.lateSubmissions}
                </div>
                <div>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: student.isAtRisk ? '#f8d7da' : '#d4edda',
                    color: student.isAtRisk ? '#721c24' : '#155724'
                  }}>
                    {student.isAtRisk ? '⚠️ Riesgo' : '✅ OK'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Analysis */}
      <div style={{ 
        padding: '25px', 
        backgroundColor: 'white', 
          borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '40px'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '20px' }}>Análisis del Curso</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px'
        }}>
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '16px' }}>Entregas a Tiempo</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
              {students.reduce((sum, s) => sum + s.onTimeSubmissions, 0)}
            </div>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              {totalAssignments > 0 
                ? Math.round((students.reduce((sum, s) => sum + s.onTimeSubmissions, 0) / totalAssignments) * 100)
                : 0}% del total
            </div>
          </div>
          
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '16px' }}>Entregas Tardías</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
              {lateSubmissions}
            </div>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              {totalAssignments > 0 
                ? Math.round((lateSubmissions / totalAssignments) * 100)
                : 0}% del total
            </div>
          </div>
          
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '16px' }}>Tareas Completadas</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#17a2b8' }}>
              {completedAssignments}
            </div>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              {totalAssignments > 0 
                ? Math.round((completedAssignments / totalAssignments) * 100)
                : 0}% del total
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {studentsAtRisk > totalStudents * 0.3 && (
        <div style={{ 
          padding: '25px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px',
          border: '1px solid #ffeaa7',
          marginBottom: '40px'
        }}>
          <h2 style={{ margin: '0 0 15px 0', color: '#856404', fontSize: '18px' }}>
            ⚠️ Recomendaciones para el Curso
          </h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
            <li>El {Math.round((studentsAtRisk / totalStudents) * 100)}% de los estudiantes están en riesgo</li>
            <li>Se recomienda revisar las estrategias de enseñanza</li>
            <li>Considerar apoyo adicional para estudiantes con bajo rendimiento</li>
            <li>Evaluar la dificultad de las tareas asignadas</li>
            <li>Implementar sesiones de tutoría o refuerzo</li>
          </ul>
        </div>
      )}

      {/* System Info */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e8f4f8', 
        borderRadius: '8px',
        border: '1px solid #bee5eb'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#0c5460' }}>Información del Sistema</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <strong>ID del curso:</strong> {course.id}
          </div>
          <div>
            <strong>Fecha de creación:</strong> {new Date(course.creationTime).toLocaleDateString()}
          </div>
          <div>
            <strong>Última actualización:</strong> {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}
