import { useState, useEffect } from 'react';
import axios from 'axios';

interface ReportsStats {
  totalStudents: number;
  totalCourses: number;
  totalSubmissions: number;
  lateSubmissions: number;
  averageCompletionRate: number;
  systemHealth: string;
  totalTeachers: number;
  activeCourses: number;
  pendingGrading: number;
  averageGrade: number;
  demo_mode?: string;
}

export const useReportsStats = () => {
  const [stats, setStats] = useState<ReportsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportsStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<ReportsStats>('http://localhost:8000/api/v1/reports/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching reports stats:', err);
        setError('Error al cargar las estadísticas del sistema.');
        // Fallback mock data if API fails
        setStats({
          totalStudents: 150,
          totalCourses: 12,
          totalSubmissions: 450,
          lateSubmissions: 45,
          averageCompletionRate: 78.5,
          systemHealth: 'healthy',
          totalTeachers: 8,
          activeCourses: 10,
          pendingGrading: 45,
          averageGrade: 8.2,
          demo_mode: 'mock',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReportsStats();
  }, []);

  return { stats, loading, error };
};
