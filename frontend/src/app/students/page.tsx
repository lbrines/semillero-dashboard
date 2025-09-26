'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'

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
}

interface StudentProgress {
  studentId: string
  totalAssignments: number
  completedAssignments: number
  completionRate: number
  averageGrade: number
  lateSubmissions: number
  onTimeSubmissions: number
  isAtRisk: boolean
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [studentProgress, setStudentProgress] = useState<Record<string, StudentProgress>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [courses, setCourses] = useState<Array<{id: string, name: string}>>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch students
        const studentsResponse = await axios.get('http://localhost:8000/api/v1/students')
        setStudents(studentsResponse.data.students || [])

        // Fetch courses for filter
        const coursesResponse = await axios.get('http://localhost:8000/api/v1/courses')
        setCourses(coursesResponse.data.courses || [])

        // Fetch progress for each student
        const progressData: Record<string, StudentProgress> = {}
        for (const student of studentsResponse.data.students || []) {
          try {
            const progressResponse = await axios.get(`http://localhost:8000/api/v1/students/${student.userId}/progress`)
            progressData[student.userId] = progressResponse.data
          } catch (err) {
            console.warn(`Could not fetch progress for student ${student.userId}`)
          }
        }
        setStudentProgress(progressData)

      } catch (err) {
        setError('Error al cargar los datos de estudiantes')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter students based on search and course
  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.profile.name.givenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.profile.name.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.profile.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCourse = selectedCourse === '' || student.courseId === selectedCourse
    
    return matchesSearch && matchesCourse
  })

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>Estudiantes</h1>
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
          <span>Cargando estudiantes...</span>
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
        <h1>Estudiantes</h1>
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
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Gestión de Estudiantes</h1>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d' }}>
            {filteredStudents.length} de {students.length} estudiantes
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

      {/* Filters */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Buscar por nombre o email:
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ej: Juan, maria@email.com"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Filtrar por curso:
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="">Todos los cursos</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '2px dashed #dee2e6'
        }}>
          <p style={{ color: '#6c757d', margin: 0 }}>
            {searchTerm || selectedCourse ? 'No se encontraron estudiantes con los filtros aplicados' : 'No hay estudiantes registrados'}
          </p>
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
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Estudiante</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Curso</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Progreso</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Estado</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const progress = studentProgress[student.userId]
                return (
                  <tr key={student.userId} style={{ borderBottom: '1px solid #f1f3f4' }}>
                    <td style={{ padding: '15px' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>
                          {student.profile.name.givenName} {student.profile.name.familyName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6c757d' }}>
                          ID: {student.userId}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>{student.profile.emailAddress}</td>
                    <td style={{ padding: '15px' }}>{student.courseName}</td>
                    <td style={{ padding: '15px' }}>
                      {progress ? (
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            {progress.completionRate}% completado
                          </div>
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            {progress.completedAssignments}/{progress.totalAssignments} tareas
                          </div>
                          {progress.averageGrade > 0 && (
                            <div style={{ fontSize: '12px', color: '#6c757d' }}>
                              Promedio: {progress.averageGrade}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#6c757d' }}>Sin datos</span>
                      )}
                    </td>
                    <td style={{ padding: '15px' }}>
                      {progress ? (
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: progress.isAtRisk ? '#f8d7da' : '#d4edda',
                          color: progress.isAtRisk ? '#721c24' : '#155724'
                        }}>
                          {progress.isAtRisk ? 'En Riesgo' : 'Bien'}
                        </span>
                      ) : (
                        <span style={{ color: '#6c757d' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <Link 
                        href={`/students/${student.userId}`}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#3498db',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                      >
                        Ver Perfil
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {filteredStudents.length > 0 && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#e8f4f8', 
          borderRadius: '8px',
          border: '1px solid #bee5eb'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#0c5460' }}>Resumen</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div>
              <strong>Total:</strong> {filteredStudents.length} estudiantes
            </div>
            <div>
              <strong>En riesgo:</strong> {filteredStudents.filter(s => studentProgress[s.userId]?.isAtRisk).length}
            </div>
            <div>
              <strong>Promedio general:</strong> {
                filteredStudents.length > 0 
                  ? Math.round(
                      filteredStudents
                        .map(s => studentProgress[s.userId]?.completionRate || 0)
                        .reduce((a, b) => a + b, 0) / filteredStudents.length
                    )
                  : 0
              }%
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
