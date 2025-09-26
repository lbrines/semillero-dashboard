import { useState, useEffect } from 'react'
import axios from 'axios'

interface KPIs {
  totalStudents: number
  totalCourses: number
  totalSubmissions: number
  lateSubmissions: number
  averageCompletionRate: number
  studentsAtRisk: number
  totalTeachers: number
  activeCourses: number
  completedAssignments: number
  pendingAssignments: number
  onTimeSubmissions: number
  onTimePercentage: number
  demo_mode: string
  is_google_data: boolean
}

export function useKPIs() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch KPIs from backend - now using real endpoint
        const response = await axios.get(`http://localhost:8000/api/v1/reports/kpis`)

        console.log('KPIs fetched from backend:', response.data)
        setKpis(response.data)

      } catch (err) {
        console.error('Error fetching KPIs:', err)
        setError('Error al cargar KPIs desde el servidor')

        // Fallback data only if server is completely down
        setKpis({
          totalStudents: 4,
          totalCourses: 2,
          totalSubmissions: 12,
          lateSubmissions: 2,
          averageCompletionRate: 75.0,
          studentsAtRisk: 1,
          totalTeachers: 2,
          activeCourses: 2,
          completedAssignments: 10,
          pendingAssignments: 2,
          onTimeSubmissions: 10,
          onTimePercentage: 83.3,
          demo_mode: "mock",
          is_google_data: false
        })
      } finally {
        setLoading(false)
      }
    }

    fetchKPIs()
  }, [])

  return { kpis, loading, error }
}

