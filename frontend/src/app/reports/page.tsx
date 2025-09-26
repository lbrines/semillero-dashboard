'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'

interface KPIs {
  totalStudents: number
  totalCourses: number
  totalAssignments: number
  averageCompletionRate: number
  studentsAtRisk: number
  averageGrade: number
  onTimeSubmissionRate: number
  lateSubmissionRate: number
}

interface CourseReport {
  courseId: string
  courseName: string
  totalStudents: number
  totalAssignments: number
  averageCompletionRate: number
  studentsAtRisk: number
  averageGrade: number
}

interface StudentReport {
  studentId: string
  studentName: string
  courseName: string
  completionRate: number
  averageGrade: number
  isAtRisk: boolean
  totalAssignments: number
  completedAssignments: number
  lateSubmissions: number
}

export default function ReportsPage() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [courseReports, setCourseReports] = useState<CourseReport[]>([])
  const [studentReports, setStudentReports] = useState<StudentReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'students'>('overview')

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch KPIs
        const kpisResponse = await axios.get('http://localhost:8000/api/v1/reports/academic')
        setKpis(kpisResponse.data)

        // Fetch course reports
        const coursesResponse = await axios.get('http://localhost:8000/api/v1/courses')
        const courses = coursesResponse.data.courses || []
        
        const courseReportsData = await Promise.all(
          courses.map(async (course: any) => {
            try {
              const studentsResponse = await axios.get(`http://localhost:8000/api/v1/courses/${course.id}/students`)
              const students = studentsResponse.data.students || []
              
              const totalStudents = students.length
              const studentsAtRisk = students.filter((s: any) => s.isAtRisk).length
              const averageCompletionRate = students.length > 0 
                ? Math.round(students.reduce((sum: number, s: any) => sum + s.completionRate, 0) / students.length)
                : 0
              const averageGrade = students.length > 0 
                ? Math.round(students.reduce((sum: number, s: any) => sum + (s.averageGrade || 0), 0) / students.length)
                : 0

              return {
                courseId: course.id,
                courseName: course.name,
                totalStudents,
                totalAssignments: course.courseworkCount || 0,
                averageCompletionRate,
                studentsAtRisk,
                averageGrade
              }
            } catch (err) {
              return {
                courseId: course.id,
                courseName: course.name,
                totalStudents: 0,
                totalAssignments: 0,
                averageCompletionRate: 0,
                studentsAtRisk: 0,
                averageGrade: 0
              }
            }
          })
        )
        setCourseReports(courseReportsData)

        // Fetch student reports
        const studentsResponse = await axios.get('http://localhost:8000/api/v1/students')
        const students = studentsResponse.data.students || []
        
        const studentReportsData = await Promise.all(
          students.map(async (student: any) => {
            try {
              const progressResponse = await axios.get(`http://localhost:8000/api/v1/students/${student.userId}/progress`)
              const progress = progressResponse.data
              
              return {
                studentId: student.userId,
                studentName: `${student.profile.name.givenName} ${student.profile.name.familyName}`,
                courseName: student.courseName,
                completionRate: progress.completionRate,
                averageGrade: progress.averageGrade,
                isAtRisk: progress.isAtRisk,
                totalAssignments: progress.totalAssignments,
                completedAssignments: progress.completedAssignments,
                lateSubmissions: progress.lateSubmissions
              }
            } catch (err) {
              return {
                studentId: student.userId,
                studentName: `${student.profile.name.givenName} ${student.profile.name.familyName}`,
                courseName: student.courseName,
                completionRate: 0,
                averageGrade: 0,
                isAtRisk: true,
                totalAssignments: 0,
                completedAssignments: 0,
                lateSubmissions: 0
              }
            }
          })
        )
        setStudentReports(studentReportsData)

      } catch (err) {
        setError('Error al cargar los reportes académicos')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReportsData()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>Reportes Académicos</h1>
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
          <span>Cargando reportes académicos...</span>
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

  if (error || !kpis) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>Reportes Académicos</h1>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p style={{ color: '#c33', margin: 0 }}>
            ❌ {error || 'No se pudieron cargar los reportes'}
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
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Reportes Académicos</h1>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d' }}>
            Análisis completo del rendimiento académico
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

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        borderBottom: '1px solid #ddd'
      }}>
        {[
          { id: 'overview', label: '📊 Resumen General' },
          { id: 'courses', label: '📚 Por Cursos' },
          { id: 'students', label: '👥 Por Estudiantes' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '12px 20px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? '#3498db' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#666',
              cursor: 'pointer',
              borderRadius: '6px 6px 0 0',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{ 
              padding: '25px', 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>👥</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3498db', marginBottom: '5px' }}>
                {kpis.totalStudents}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Total Estudiantes</div>
            </div>

            <div style={{ 
              padding: '25px', 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📚</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745', marginBottom: '5px' }}>
                {kpis.totalCourses}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Total Cursos</div>
            </div>

            <div style={{ 
              padding: '25px', 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📝</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107', marginBottom: '5px' }}>
                {kpis.totalAssignments}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Total Tareas</div>
            </div>

            <div style={{ 
              padding: '25px', 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📈</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#17a2b8', marginBottom: '5px' }}>
                {kpis.averageCompletionRate}%
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Progreso Promedio</div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{ 
              padding: '25px', 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Estudiantes en Riesgo</h3>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <span>Total en riesgo:</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                  {kpis.studentsAtRisk}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between'
              }}>
                <span>Porcentaje:</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc3545' }}>
                  {kpis.totalStudents > 0 ? Math.round((kpis.studentsAtRisk / kpis.totalStudents) * 100) : 0}%
                </span>
              </div>
            </div>

            <div style={{ 
              padding: '25px', 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Rendimiento General</h3>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <span>Promedio general:</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                  {kpis.averageGrade > 0 ? kpis.averageGrade : 'N/A'}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between'
              }}>
                <span>Entregas a tiempo:</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                  {kpis.onTimeSubmissionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div>
          <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Reportes por Curso</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '20px'
          }}>
            {courseReports.map(course => (
              <div key={course.courseId} style={{ 
                padding: '25px', 
                backgroundColor: 'white', 
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>{course.courseName}</h3>
                
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span><strong>Progreso promedio:</strong></span>
                    <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
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

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3498db' }}>
                      {course.totalStudents}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>Estudiantes</div>
                  </div>
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffc107' }}>
                      {course.totalAssignments}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>Tareas</div>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px' }}>
                    <strong>Promedio:</strong> {course.averageGrade > 0 ? course.averageGrade : 'N/A'}
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: course.studentsAtRisk > 0 ? '#f8d7da' : '#d4edda',
                    color: course.studentsAtRisk > 0 ? '#721c24' : '#155724'
                  }}>
                    {course.studentsAtRisk} en riesgo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div>
          <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Reportes por Estudiante</h2>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            overflow: 'hidden'
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
              <div>Curso</div>
              <div>Progreso</div>
              <div>Promedio</div>
              <div>Completadas</div>
              <div>Estado</div>
            </div>
            
            {studentReports.map(student => (
              <div key={student.studentId} style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', 
                gap: '15px',
                padding: '15px 20px',
                borderBottom: '1px solid #f1f3f4',
                alignItems: 'center'
              }}>
                <div>
                  <Link 
                    href={`/students/${student.studentId}`}
                    style={{ 
                      color: '#3498db', 
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    {student.studentName}
                  </Link>
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {student.courseName}
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
            <strong>Última actualización:</strong> {new Date().toLocaleString()}
          </div>
          <div>
            <strong>Total de registros:</strong> {studentReports.length} estudiantes
          </div>
          <div>
            <strong>Modo de datos:</strong> Mock (Demo)
          </div>
        </div>
      </div>
    </div>
  )
}
