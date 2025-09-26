'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KPICard } from '@/components/ui/kpi-card';
import { CohortProgressChart } from '@/components/charts/CohortProgressChart';
import { useCohortProgress } from '@/hooks/useCohortProgress';
import { Users, BookOpen, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedCohort, setSelectedCohort] = useState<string>('');

  // Mock data for demonstration
  const mockData = {
    cohorts: [
      {
        cohort_id: "course_1_cohort_001",
        cohort_name: "Cohorte Especialista en Ecommerce 2024-1",
        total_students: 2,
        total_submissions: 6,
        on_time_submissions: 4,
        late_submissions: 2,
        on_time_percentage: 66.67,
        late_percentage: 33.33,
        courses: [
          {
            course_id: "course_1",
            course_name: "Especialista en Ecommerce",
            total_students: 2,
            on_time_submissions: 4,
            late_submissions: 2,
            on_time_percentage: 66.67,
            late_percentage: 33.33,
          }
        ],
        is_google_data: false
      },
      {
        cohort_id: "course_2_cohort_001",
        cohort_name: "Cohorte Especialista en Marketing Digital 2024-1",
        total_students: 2,
        total_submissions: 6,
        on_time_submissions: 4,
        late_submissions: 2,
        on_time_percentage: 66.67,
        late_percentage: 33.33,
        courses: [
          {
            course_id: "course_2",
            course_name: "Especialista en Marketing Digital",
            total_students: 2,
            on_time_submissions: 4,
            late_submissions: 2,
            on_time_percentage: 66.67,
            late_percentage: 33.33,
          }
        ],
        is_google_data: false
      }
    ],
    total_cohorts: 2,
    page_size: 10,
    page_token: null,
    has_next_page: false
  };

  // Calculate KPIs from mock data
  const calculateKPIs = () => {
    const totalStudents = mockData.cohorts.reduce((sum, cohort) => sum + cohort.total_students, 0);
    const totalCourses = mockData.cohorts.length;
    const totalSubmissions = mockData.cohorts.reduce((sum, cohort) => sum + cohort.total_submissions, 0);
    const onTimeSubmissions = mockData.cohorts.reduce((sum, cohort) => sum + cohort.on_time_submissions, 0);
    const lateSubmissions = mockData.cohorts.reduce((sum, cohort) => sum + cohort.late_submissions, 0);
    const averageOnTime = totalSubmissions > 0 ? (onTimeSubmissions / totalSubmissions) * 100 : 0;

    return {
      totalStudents,
      totalCourses,
      averageOnTime,
      totalSubmissions,
      lateSubmissions,
      onTimeSubmissions,
    };
  };

  const kpis = calculateKPIs();

  const handleCohortFilter = (cohortId: string) => {
    setSelectedCohort(cohortId);
  };

  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>Reportes Académicos</h1>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '10px',
          marginTop: '20px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span>Cargando reportes académicos...</span>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #eee'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Reportes Académicos</h1>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d' }}>Análisis de progreso de cohortes</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <nav style={{ display: 'flex', gap: '15px' }}>
            <a href="/" style={{ color: '#7f8c8d', textDecoration: 'none' }}>Dashboard</a>
            <a href="/students" style={{ color: '#7f8c8d', textDecoration: 'none' }}>Estudiantes</a>
            <a href="/courses" style={{ color: '#7f8c8d', textDecoration: 'none' }}>Cursos</a>
            <a href="/reports" style={{ color: '#2c3e50', textDecoration: 'none', fontWeight: 'bold' }}>Reportes</a>
          </nav>
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#e8f4f8',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2980b9'
          }}>
            MODO MOCK
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #eee'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '14px' }}>Total Estudiantes</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2c3e50' }}>{kpis.totalStudents}</div>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '12px' }}>Estudiantes activos en todas las cohortes</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #eee'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '14px' }}>Cursos Monitoreados</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2c3e50' }}>{kpis.totalCourses}</div>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '12px' }}>Número de cursos activos</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #eee'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '14px' }}>Promedio Entregas</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60' }}>{kpis.averageOnTime.toFixed(1)}%</div>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '12px' }}>Porcentaje promedio de entregas a tiempo</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #eee'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '14px' }}>Entregas Tardías</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e74c3c' }}>{kpis.lateSubmissions}</div>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '12px' }}>Total de entregas tardías</p>
        </div>
      </div>

      {/* Cohort Filter */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #eee',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Filtrar por Cohorte</h3>
        <p style={{ margin: '0 0 15px 0', color: '#7f8c8d', fontSize: '14px' }}>Selecciona una cohorte específica para ver detalles</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={() => handleCohortFilter('')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: selectedCohort === '' ? '#3498db' : '#ecf0f1',
              color: selectedCohort === '' ? 'white' : '#2c3e50',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Todas las Cohortes
          </button>
          {mockData.cohorts.map((cohort) => (
            <button
              key={cohort.cohort_id}
              onClick={() => handleCohortFilter(cohort.cohort_id)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: selectedCohort === cohort.cohort_id ? '#3498db' : '#ecf0f1',
                color: selectedCohort === cohort.cohort_id ? 'white' : '#2c3e50',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {cohort.cohort_name.replace('Cohorte ', '').replace(' 2024-1', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #eee',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Progreso de Cohortes</h3>
        <p style={{ margin: '0 0 20px 0', color: '#7f8c8d', fontSize: '14px' }}>Progreso de entregas por cohorte</p>
        
        {/* Simple Chart Representation */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {mockData.cohorts.map((cohort) => (
            <div key={cohort.cohort_id} style={{
              padding: '15px',
              border: '1px solid #eee',
              borderRadius: '6px',
              backgroundColor: '#f8f9fa'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                {cohort.cohort_name.replace('Cohorte ', '').replace(' 2024-1', '')}
              </h4>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Entregas a Tiempo</span>
                    <span style={{ fontSize: '12px', color: '#27ae60', fontWeight: 'bold' }}>{cohort.on_time_submissions}</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: '#ecf0f1', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${cohort.on_time_percentage}%`, 
                      height: '100%', 
                      backgroundColor: '#27ae60' 
                    }}></div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Entregas Tardías</span>
                    <span style={{ fontSize: '12px', color: '#e74c3c', fontWeight: 'bold' }}>{cohort.late_submissions}</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: '#ecf0f1', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${cohort.late_percentage}%`, 
                      height: '100%', 
                      backgroundColor: '#e74c3c' 
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #eee'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#27ae60', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✓ Entregas a Tiempo
          </h3>
          <p style={{ margin: '0 0 15px 0', color: '#7f8c8d', fontSize: '14px' }}>Resumen de entregas puntuales</p>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60' }}>
            {kpis.onTimeSubmissions}
          </div>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '12px' }}>
            {((kpis.onTimeSubmissions / kpis.totalSubmissions) * 100).toFixed(1)}% del total
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #eee'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⏰ Entregas Tardías
          </h3>
          <p style={{ margin: '0 0 15px 0', color: '#7f8c8d', fontSize: '14px' }}>Resumen de entregas tardías</p>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e74c3c' }}>
            {kpis.lateSubmissions}
          </div>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '12px' }}>
            {((kpis.lateSubmissions / kpis.totalSubmissions) * 100).toFixed(1)}% del total
          </p>
        </div>
      </div>

      {/* Demo Mode Indicator */}
      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #eee'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7f8c8d', fontSize: '14px' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#3498db', borderRadius: '50%' }}></div>
          Modo Demo: Datos simulados para demostración
        </div>
      </div>
    </div>
  );
}