import { useState, useEffect } from 'react';
import axios from 'axios';

interface Teacher {
  teacher_id: string;
  name: string;
  email: string;
  role: string;
  courses: string[];
  active: boolean;
  demo_mode?: string;
}

export const useTeacherById = (teacherId: string) => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!teacherId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<Teacher>(`http://localhost:8000/api/v1/teachers/${teacherId}`);
        setTeacher(response.data);
      } catch (err) {
        console.error('Error fetching teacher:', err);
        setError('Error al cargar la información del profesor.');
        // Fallback mock data if API fails
        setTeacher({
          teacher_id: teacherId,
          name: 'Profesor Mock',
          email: 'profesor@example.com',
          role: 'docente',
          courses: ['curso_001'],
          active: true,
          demo_mode: 'mock',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [teacherId]);

  return { teacher, loading, error };
};
