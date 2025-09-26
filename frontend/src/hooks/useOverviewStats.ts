import { useState, useEffect } from 'react'
import axios from 'axios'

interface OverviewStats {
  retentionRate: number
  completionRate: number
  averageGrade: number
  studentsAtRisk: number
  totalActiveCourses: number
  totalStudents: number
  totalTeachers: number
  totalSubmissions: number
  lateSubmissions: number
  averageCompletionTime: number
  demo_mode?: string
}

export function useOverviewStats() {
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOverviewStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch overview stats from backend
        const response = await axios.get(`http://localhost:8000/api/v1/reports/overview`)

        setStats(response.data)

      } catch (err) {
        console.error('Error fetching overview stats:', err)
        setError('Error al cargar estadísticas generales')
        
        // Fallback data si el endpoint no existe aún
        setStats({
          retentionRate: 92,
          completionRate: 79,
          averageGrade: 8.3,
          studentsAtRisk: 5,
          totalActiveCourses: 6,
          totalStudents: 45,
          totalTeachers: 8,
          totalSubmissions: 156,
          lateSubmissions: 12,
          averageCompletionTime: 2.5,
          demo_mode: 'mock'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOverviewStats()
  }, [])

  return { stats, loading, error }
}

