// Hook para obtener datos del dashboard según el rol del usuario

import { useState, useEffect } from 'react'
import { DashboardData } from '@/types'
import { getDashboardData } from '@/lib/mockData'
import { useAuthContext } from '@/components/auth/AuthProvider'

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // Simular delay de carga
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const dashboardData = getDashboardData(user.role)
        setData(dashboardData)
      } catch (err) {
        setError('Error al cargar los datos del dashboard')
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  return {
    data,
    loading,
    error
  }
}
