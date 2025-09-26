'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface RoleContextType {
  role: string | null
  hasPermission: (permission: string) => boolean
  canSearchStudents: boolean
  canViewAllReports: boolean
  canManageUsers: boolean
  canViewGlobalStats: boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const role = user?.role || null

  const hasPermission = (permission: string): boolean => {
    if (!role) return false

    const permissions: Record<string, string[]> = {
      'student': ['VIEW_OWN_PROGRESS'],
      'teacher': ['VIEW_OWN_PROGRESS', 'VIEW_OWN_STUDENTS', 'STUDENTS_SEARCH', 'VIEW_OWN_COURSES'],
      'coordinator': ['VIEW_OWN_PROGRESS', 'VIEW_OWN_STUDENTS', 'STUDENTS_SEARCH', 'VIEW_OWN_COURSES', 'VIEW_GLOBAL_REPORTS', 'SEARCH_COHORT_STUDENTS'],
      'admin': ['VIEW_OWN_PROGRESS', 'VIEW_OWN_STUDENTS', 'STUDENTS_SEARCH', 'VIEW_OWN_COURSES', 'VIEW_GLOBAL_REPORTS', 'SEARCH_COHORT_STUDENTS', 'MANAGE_USERS', 'VIEW_GLOBAL_STATS', 'SEARCH_ALL_STUDENTS']
    }

    return permissions[role]?.includes(permission) || false
  }

  const canSearchStudents = hasPermission('STUDENTS_SEARCH') || hasPermission('SEARCH_COHORT_STUDENTS') || hasPermission('SEARCH_ALL_STUDENTS')
  const canViewAllReports = hasPermission('VIEW_GLOBAL_REPORTS')
  const canManageUsers = hasPermission('MANAGE_USERS')
  const canViewGlobalStats = hasPermission('VIEW_GLOBAL_STATS')

  const value: RoleContextType = {
    role,
    hasPermission,
    canSearchStudents,
    canViewAllReports,
    canManageUsers,
    canViewGlobalStats
  }

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
