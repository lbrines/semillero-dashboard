import { useState, useEffect } from 'react'
import axios from 'axios'

interface CoordinatorStats {
  coordinator_id: string
  coordinator_name: string
  totalCohorts: number
  totalStudents: number
  totalTeachers: number
  averageCohortProgress: number
  cohortsAtRisk: number
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

  useEffect(() => {
    const fetchCoordinatorStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // For now, use a mock coordinator ID
        // In a real app, this would come from authentication context
        const coordinatorId = 'coord_001' // Mock coordinator ID

        // Fetch coordinator dashboard from new endpoint
        const response = await axios.get(`http://localhost:8000/api/v1/reports/coordinators/${coordinatorId}/dashboard`)

        console.log('Coordinator dashboard fetched:', response.data)
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
          upcomingMilestones: [
            { milestone: 'Fin Módulo 1', date: '2024-02-15', courses_affected: 2 },
            { milestone: 'Evaluaciones Finales', date: '2024-03-01', courses_affected: 2 }
          ],
          demo_mode: 'mock'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCoordinatorStats()
  }, [])

  return { stats, loading, error }
}

