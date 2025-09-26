// Tipos de usuario y autenticación
export type UserRole = 'student' | 'teacher' | 'coordinator' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  cohort?: string
  course?: string
}

// Tipos para KPIs
export interface KPICard {
  title: string
  value: string | number
  unit?: string
  change?: number
  changeType?: 'increase' | 'decrease' | 'unchanged'
  icon?: string
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'yellow'
}

// Tipos para gráficos
export interface ChartData {
  name: string
  value: number
  color?: string
  [key: string]: any
}

// Tipos para tablas
export interface TableColumn<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

// Tipos para datos de dashboard
export interface DashboardData {
  kpis: KPICard[]
  charts: {
    progress: ChartData[]
    timeline: ChartData[]
    distribution: ChartData[]
  }
  tasks?: any[]
  students?: any[]
  courses?: any[]
}

// Tipos para autenticación
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  mode: 'mock' | 'google'
  login: (role: UserRole) => Promise<void>
  loginGoogle: () => Promise<void>
  logout: () => void
  changeMode: (mode: 'mock' | 'google') => void
}

// Tipos para estados de carga
export interface LoadingState {
  loading: boolean
  error: string | null
  data: any
}

// Tipos para filtros
export interface FilterOptions {
  course?: string
  cohort?: string
  role?: UserRole
  dateRange?: {
    start: Date
    end: Date
  }
}

// Tipos para métricas
export interface Metric {
  label: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  percentage: number
}

// Tipos para notificaciones
export interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}