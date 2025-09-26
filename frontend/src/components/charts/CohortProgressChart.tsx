import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CohortProgress } from '@/hooks/useCohortProgress';

interface CohortProgressChartProps {
  data: CohortProgress[];
  loading?: boolean;
  error?: string | null;
}

export function CohortProgressChart({ data, loading, error }: CohortProgressChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progreso de Cohortes</CardTitle>
          <CardDescription>Progreso de entregas por cohorte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Cargando datos...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progreso de Cohortes</CardTitle>
          <CardDescription>Progreso de entregas por cohorte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-destructive">Error: {error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progreso de Cohortes</CardTitle>
          <CardDescription>Progreso de entregas por cohorte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">No hay datos disponibles</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for chart
  const chartData = data.map(cohort => ({
    name: cohort.cohort_name.replace('Cohorte ', '').replace(' 2024-1', ''),
    'Entregas a Tiempo': cohort.on_time_submissions,
    'Entregas Tardías': cohort.late_submissions,
    'Porcentaje a Tiempo': cohort.on_time_percentage,
    'Porcentaje Tardío': cohort.late_percentage,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progreso de Cohortes</CardTitle>
        <CardDescription>Progreso de entregas por cohorte</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Entregas a Tiempo" fill="#10b981" />
              <Bar dataKey="Entregas Tardías" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
