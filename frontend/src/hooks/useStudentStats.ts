import { useState, useEffect } from 'react'
import axios from 'axios'

interface UpcomingDeadline {
  assignment_id: string
  assignment_title: string
  course_name: string
  due_date: string
  days_remaining: number
}

interface RecentActivity {
  activity_type: string
  assignment_title: string
  course_name: string
  activity_date: string
  status: string
}

interface StudentStats {
  student_id: string
  student_name: string
  myCourses: number
  completedSubmissions: number
  pendingSubmissions: number
  averageGrade: number
  completionRate: number
  lateSubmissions: number
  upcomingDeadlines: UpcomingDeadline[]
  recentActivity: RecentActivity[]
  isAtRisk: boolean
  demo_mode: string
}

export function useStudentStats() {
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudentStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // For now, use a mock student ID
        // In a real app, this would come from authentication context
        const studentId = 'student_1' // Mock student ID

        // Fetch student dashboard from new endpoint
        const response = await axios.get(`http://localhost:8000/api/v1/students/${studentId}/dashboard`)

        console.log('Student dashboard fetched:', response.data)
        setStats(response.data)

      } catch (err) {
        console.error('Error fetching student dashboard:', err)
        setError('Error al cargar dashboard del estudiante')

        // Fallback data if server is down
        setStats({
          student_id: 'student_mock',
          student_name: 'Estudiante Mock',
          myCourses: 2,
          completedSubmissions: 8,
          pendingSubmissions: 3,
          averageGrade: 8.5,
          completionRate: 75.0,
          lateSubmissions: 1,
          upcomingDeadlines: [],
          recentActivity: [],
          isAtRisk: false,
          demo_mode: 'mock'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStudentStats()
  }, [])

  return { stats, loading, error }
}

