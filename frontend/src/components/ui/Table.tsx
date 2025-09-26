// Componente Table para mostrar datos tabulares

import { StudentProgress, Task } from '@/types'

interface TableProps {
  data: StudentProgress[] | Task[]
  type: 'students' | 'tasks'
  className?: string
}

export const Table = ({ data, type, className = '' }: TableProps) => {
  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium'
    
    switch (status) {
      case 'excellent':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'good':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'progress':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'at-risk':
        return `${baseClasses} bg-red-100 text-red-800`
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'late':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Excelente'
      case 'good':
        return 'Bueno'
      case 'progress':
        return 'En Progreso'
      case 'at-risk':
        return 'En Riesgo'
      case 'completed':
        return 'Completado'
      case 'pending':
        return 'Pendiente'
      case 'late':
        return 'Tardío'
      default:
        return status
    }
  }

  const renderStudentTable = () => {
    const students = data as StudentProgress[]
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estudiante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Curso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progreso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Promedio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.course}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(student.completedTasks / student.totalTasks) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-900">
                      {student.completedTasks}/{student.totalTasks}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.averageGrade}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(student.status)}>
                    {getStatusText(student.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderTaskTable = () => {
    const tasks = data as Task[]
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarea
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Curso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Entrega
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calificación
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{task.course}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(task.dueDate).toLocaleDateString('es-ES')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(task.status)}>
                    {getStatusText(task.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {task.grade ? task.grade : '-'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {type === 'students' ? renderStudentTable() : renderTaskTable()}
    </div>
  )
}
