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

export interface ChartDataPoint {
  name: string;
  onTime: number;
  late: number;
  percentage: number;
}

export interface TrendsData {
  period: string;
  onTimeSubmissions: number;
  lateSubmissions: number;
  totalSubmissions: number;
}

export interface CohortProgressResponse {
  cohorts: CohortProgress[];
  total_cohorts: number;
  page_size: number;
  page_token: string | null;
  has_next_page: boolean;
  chartData: ChartDataPoint[];
  trends: TrendsData[];
  summary: {
    totalSubmissions: number;
    overallOnTimePercentage: number;
    bestPerformingCohort: string;
    worstPerformingCohort: string;
  };
  demo_mode?: string;
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
        `http://localhost:8000/api/v1/reports/cohort-progress?${params}`,
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
      console.log('Cohort progress data fetched:', result);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos de reportes');
      console.error('Error fetching cohort progress:', err);

      // Fallback data if server is down
      setData({
        cohorts: [],
        total_cohorts: 2,
        page_size: 10,
        page_token: null,
        has_next_page: false,
        chartData: [
          { name: 'Ecommerce', onTime: 8, late: 4, percentage: 66.7 },
          { name: 'Marketing', onTime: 6, late: 6, percentage: 50.0 }
        ],
        trends: [
          { period: 'Enero 2024', onTimeSubmissions: 10, lateSubmissions: 5, totalSubmissions: 15 },
          { period: 'Febrero 2024', onTimeSubmissions: 14, lateSubmissions: 10, totalSubmissions: 24 }
        ],
        summary: {
          totalSubmissions: 24,
          overallOnTimePercentage: 58.3,
          bestPerformingCohort: 'Ecommerce 2024-1',
          worstPerformingCohort: 'Marketing 2024-1'
        },
        demo_mode: 'mock'
      });
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
