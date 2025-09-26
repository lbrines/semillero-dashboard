'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/courses')
        setCourses(response.data.courses || [])
      } catch (err) {
        setError('Error al cargar los cursos')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Semillero Dashboard</h1>
        <p>Cargando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Semillero Dashboard</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Semillero Dashboard - Modo Mock</h1>
      <p>Backend funcionando en modo mock con datos de prueba</p>
      
      <h2>Cursos Disponibles ({courses.length})</h2>
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        {courses.map((course: any) => (
          <div 
            key={course.id} 
            style={{ 
              border: '1px solid #ccc', 
              padding: '20px', 
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3>{course.name}</h3>
            <p><strong>Sección:</strong> {course.section}</p>
            <p><strong>Descripción:</strong> {course.description}</p>
            <p><strong>Estado:</strong> {course.course_state}</p>
            <p><strong>Código:</strong> {course.enrollment_code}</p>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#e8f4f8', borderRadius: '8px' }}>
        <h3>Información del Sistema</h3>
        <p><strong>Modo:</strong> Mock (Datos de prueba)</p>
        <p><strong>Backend:</strong> http://localhost:8000</p>
        <p><strong>Frontend:</strong> http://localhost:3000</p>
        <p><strong>API Docs:</strong> <a href="http://localhost:8000/docs" target="_blank">http://localhost:8000/docs</a></p>
      </div>
    </div>
  )
}