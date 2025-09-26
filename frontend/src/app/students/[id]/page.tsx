'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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

export default function StudentProfilePage() {
  const params = useParams()
  const studentId = params.id as string
  
  const [student, setStudent] = useState<Student | null>(null)
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch student details
        const studentResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/students/${studentId}`)
        setStudent(studentResponse.data)

        // Fetch student progress
        const progressResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/students/${studentId}/progress`)
        setProgress(progressResponse.data)

      } catch (err) {
        setError('Error al cargar los datos del estudiante')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (studentId) {
      fetchStudentData()
    }
  }, [studentId])

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>Perfil del Estudiante</h1>
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
          <span>Cargando perfil del estudiante...</span>
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

  if (error || !student) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>Perfil del Estudiante</h1>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p style={{ color: '#c33', margin: 0 }}>
            ❌ {error || 'Estudiante no encontrado'}
          </p>
          <div style={{ marginTop: '15px' }}>
            <Link 
              href="/students"
              style={{
                padding: '8px 16px',
                backgroundColor: '#3498db',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                marginRight: '10px'
              }}
            >
              ← Volver a Estudiantes
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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
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
          <h1 style={{ margin: 0, color: '#2c3e50' }}>
            {student.profile.name.givenName} {student.profile.name.familyName}
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d' }}>
            Perfil del estudiante
          </p>
        </div>
        <Link 
          href="/students" 
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          ← Volver a Estudiantes
        </Link>
      </div>

      {/* Student Info */}
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
          <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '20px' }}>Información Personal</h2>
          <div style={{ marginBottom: '15px' }}>
            <strong>Nombre completo:</strong><br />
            {student.profile.name.givenName} {student.profile.name.familyName}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Email:</strong><br />
            <a href={`mailto:${student.profile.emailAddress}`} style={{ color: '#3498db' }}>
              {student.profile.emailAddress}
            </a>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>ID del estudiante:</strong><br />
            <code style={{ 
              padding: '2px 6px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '3px',
              fontSize: '12px'
            }}>
              {student.userId}
            </code>
          </div>
          <div>
            <strong>Curso actual:</strong><br />
            {student.courseName}
          </div>
        </div>

        {/* Progress Summary */}
        {progress && (
          <div style={{ 
            padding: '25px', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '20px' }}>Resumen de Progreso</h2>
            
            {/* Completion Rate */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span><strong>Progreso del curso:</strong></span>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                  {progress.completionRate}%
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
                  width: `${progress.completionRate}%`, 
                  height: '100%', 
                  backgroundColor: progress.completionRate >= 70 ? '#28a745' : progress.completionRate >= 50 ? '#ffc107' : '#dc3545',
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
                  {progress.completedAssignments}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                  Tareas completadas
                </div>
              </div>
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                  {progress.totalAssignments}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                  Total de tareas
                </div>
              </div>
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                  {progress.averageGrade > 0 ? progress.averageGrade : 'N/A'}
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
                  {progress.lateSubmissions}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                  Entregas tardías
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
                backgroundColor: progress.isAtRisk ? '#f8d7da' : '#d4edda',
                color: progress.isAtRisk ? '#721c24' : '#155724'
              }}>
                {progress.isAtRisk ? '⚠️ Estudiante en Riesgo' : '✅ Progreso Adecuado'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Progress */}
      {progress && (
        <div style={{ 
          padding: '25px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '40px'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '20px' }}>Análisis Detallado</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px'
          }}>
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '16px' }}>Entregas a Tiempo</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
                {progress.onTimeSubmissions}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>
                {progress.totalAssignments > 0 
                  ? Math.round((progress.onTimeSubmissions / progress.totalAssignments) * 100)
                  : 0}% del total
              </div>
            </div>
            
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '16px' }}>Entregas Tardías</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
                {progress.lateSubmissions}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>
                {progress.totalAssignments > 0 
                  ? Math.round((progress.lateSubmissions / progress.totalAssignments) * 100)
                  : 0}% del total
              </div>
            </div>
            
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '16px' }}>Tareas Pendientes</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6c757d' }}>
                {progress.totalAssignments - progress.completedAssignments}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>
                Por completar
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {progress && progress.isAtRisk && (
        <div style={{ 
          padding: '25px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px',
          border: '1px solid #ffeaa7',
          marginBottom: '40px'
        }}>
          <h2 style={{ margin: '0 0 15px 0', color: '#856404', fontSize: '18px' }}>
            ⚠️ Recomendaciones
          </h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
            <li>El estudiante tiene un progreso por debajo del 50%</li>
            <li>Se recomienda contacto directo para identificar dificultades</li>
            <li>Considerar apoyo adicional o tutoría</li>
            <li>Revisar si hay problemas técnicos o de acceso</li>
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
            <strong>ID del estudiante:</strong> {student.userId}
          </div>
          <div>
            <strong>Curso:</strong> {student.courseName}
          </div>
          <div>
            <strong>Última actualización:</strong> {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}
