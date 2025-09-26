import { useState, useEffect } from 'react'
import axios from 'axios'

interface StudentProgress {
  name: string;
  course: string;
  completionRate: number;
  averageGrade: number;
  status: 'at-risk' | 'on-track' | 'excellent';
}

interface CoordinatorStats {
  coordinator_id: string
  coordinator_name: string
  totalCohorts: number
  totalStudents: number
  totalTeachers: number
  averageCohortProgress: number
  cohortsAtRisk: number
  completionRate: number
  punctualityRate: number
  studentsAtRisk: number
  averageGrade: number
  studentProgress: StudentProgress[]
  upcomingMilestones: Array<{
    milestone: string
    date: string
    courses_affected: number
  }>
  demo_mode: string
}

export function useCoordinatorStats() {
  const [stats, setStats] = useState<CoordinatorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log('useCoordinatorStats hook initialized')

  useEffect(() => {
    const fetchCoordinatorStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // For now, use a mock coordinator ID
        // In a real app, this would come from authentication context
        const coordinatorId = 'coord_1' // Mock coordinator ID

        console.log('Starting fetch for coordinator:', coordinatorId)

        // Fetch coordinator dashboard from new endpoint
        const response = await axios.get(`http://localhost:8000/api/v1/reports/coordinators/${coordinatorId}/dashboard`)

        console.log('Coordinator dashboard fetched:', response.data)
        console.log('StudentProgress length:', response.data.studentProgress?.length)
        setStats(response.data)

      } catch (err) {
        console.error('Error fetching coordinator dashboard:', err)
        setError('Error al cargar dashboard del coordinador')

        // Fallback data if server is down
        setStats({
          coordinator_id: 'coord_mock',
          coordinator_name: 'Coordinador Mock',
          totalCohorts: 2,
          totalStudents: 4,
          totalTeachers: 2,
          averageCohortProgress: 85.0,
          cohortsAtRisk: 1,
          completionRate: 79,
          punctualityRate: 85,
          studentsAtRisk: 10,
          averageGrade: 8.0,
          studentProgress: [
            { name: 'Juan Pérez', course: 'Ecommerce 2024-1', completionRate: 80, averageGrade: 9.2, status: 'on-track' },
            { name: 'María García', course: 'Ecommerce 2024-1', completionRate: 60, averageGrade: 8.5, status: 'at-risk' },
            { name: 'Carlos López', course: 'Marketing 2024-1', completionRate: 67, averageGrade: 7.8, status: 'at-risk' },
            { name: 'Ana Martínez', course: 'Marketing 2024-1', completionRate: 100, averageGrade: 8.9, status: 'excellent' },
          ],
          upcomingMilestones: [
            { milestone: 'Fin Módulo 1', date: '2024-02-15', courses_affected: 2 },
            { milestone: 'Evaluaciones Finales', date: '2024-03-01', courses_affected: 2 }
          ],
          demo_mode: 'mock'
        })
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }

    fetchCoordinatorStats()
  }, [])

  return { stats, loading, error }
}

