import { useState, useEffect } from 'react';

export interface CourseProgress {
  course_id: string;
  course_name: string;
  total_students: number;
  on_time_submissions: number;
  late_submissions: number;
  on_time_percentage: number;
  late_percentage: number;
}

export interface CohortProgress {
  cohort_id: string;
  cohort_name: string;
  total_students: number;
  total_submissions: number;
  on_time_submissions: number;
  late_submissions: number;
  on_time_percentage: number;
  late_percentage: number;
  courses: CourseProgress[];
  is_google_data: boolean;
}

export interface CohortProgressResponse {
  cohorts: CohortProgress[];
  total_cohorts: number;
  page_size: number;
  page_token: string | null;
  has_next_page: boolean;
}

export function useCohortProgress() {
  const [data, setData] = useState<CohortProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCohortProgress = async (
    cohortId?: string,
    courseId?: string,
    pageSize?: number,
    pageToken?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (cohortId) params.append('cohort_id', cohortId);
      if (courseId) params.append('course_id', courseId);
      if (pageSize) params.append('pageSize', pageSize.toString());
      if (pageToken) params.append('pageToken', pageToken);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend:8000'}/api/v1/reports/cohort-progress?${params}`,
        {
          headers: {
            'X-User-Email': 'admin@instituto.edu', // Mock authentication
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos de reportes');
      console.error('Error fetching cohort progress:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCohortProgress();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchCohortProgress,
  };
}
