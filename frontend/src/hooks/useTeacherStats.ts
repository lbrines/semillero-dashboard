import { useState, useEffect } from 'react'
import axios from 'axios'

interface UpcomingDeadline {
  assignment_id: string
  assignment_title: string
  course_name: string
  due_date: string
  days_remaining: number
}

interface TeacherStats {
  teacher_id: string
  teacher_name: string
  myClasses: number
  totalStudents: number
  pendingGrading: number
  averageClassGrade: number
  studentProgress: Array<{
    student_name: string
    completion_rate: number
    average_grade: number
    status: string
  }>
  upcomingDeadlines: UpcomingDeadline[]
  demo_mode: string
}

export function useTeacherStats() {
  const [stats, setStats] = useState<TeacherStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeacherStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // For now, use a mock teacher ID
        // In a real app, this would come from authentication context
        const teacherId = 'teacher_001' // Mock teacher ID

        // Fetch teacher dashboard from new endpoint
        const response = await axios.get(`http://localhost:8000/api/v1/teachers/${teacherId}/dashboard`)

        console.log('Teacher dashboard fetched:', response.data)
        setStats(response.data)

      } catch (err) {
        console.error('Error fetching teacher dashboard:', err)
        setError('Error al cargar dashboard del profesor')

        // Fallback data if server is down
        setStats({
          teacher_id: 'teacher_mock',
          teacher_name: 'Profesor Mock',
          myClasses: 3,
          totalStudents: 45,
          pendingGrading: 12,
          averageClassGrade: 8.2,
          studentProgress: [
            { student_name: 'Ana García', completion_rate: 85, average_grade: 87, status: 'En buen estado' },
            { student_name: 'Pedro López', completion_rate: 60, average_grade: 72, status: 'Requiere atención' }
          ],
          upcomingDeadlines: [],
          demo_mode: 'mock'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTeacherStats()
  }, [])

  return { stats, loading, error }
}

