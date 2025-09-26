import { useState, useEffect } from 'react';
import axios from 'axios';

interface TeacherStats {
  totalTeachers: number;
  activeTeachers: number;
  totalCourses: number;
  averageStudentsPerTeacher: number;
  pendingGrading: number;
  averageGrade: number;
  demo_mode?: string;
}

export const useTeacherStats = () => {
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<TeacherStats>('http://localhost:8000/api/v1/teachers/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching teacher stats:', err);
        setError('Error al cargar las estadísticas de profesores.');
        // Fallback mock data if API fails
        setStats({
          totalTeachers: 8,
          activeTeachers: 6,
          totalCourses: 12,
          averageStudentsPerTeacher: 25,
          pendingGrading: 45,
          averageGrade: 8.2,
          demo_mode: 'mock',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherStats();
  }, []);

  return { stats, loading, error };
};