from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from ..services.base import BaseDataDriver
from .dependencies import get_data_driver

router = APIRouter()

@router.get("/reports/academic")
async def get_academic_reports(
    start_date: Optional[str] = Query(None, description="Fecha de inicio (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Fecha de fin (YYYY-MM-DD)"),
    course_id: Optional[str] = Query(None, description="Filtrar por curso"),
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener reportes académicos"""
    try:
        # Obtener todos los cursos
        courses_result = await data_driver.get_courses(page_size=100)
        courses = courses_result.get("courses", [])
        
        if course_id:
            courses = [c for c in courses if c["id"] == course_id]
        
        total_students = 0
        total_courses = len(courses)
        total_submissions = 0
        late_submissions = 0
        students_at_risk = 0
        
        course_stats = []
        
        for course in courses:
            # Obtener estudiantes del curso
            students_result = await data_driver.get_students(course["id"], page_size=100)
            students = students_result.get("students", [])
            course_student_count = len(students)
            total_students += course_student_count
            
            # Obtener coursework del curso
            coursework_result = await data_driver.get_coursework(course["id"], page_size=100)
            assignments = coursework_result.get("courseWork", [])
            
            course_submissions = 0
            course_late = 0
            course_at_risk = 0
            
            # Calcular métricas por curso
            for assignment in assignments:
                submissions_result = await data_driver.get_submissions(
                    course["id"], 
                    assignment["id"], 
                    page_size=100
                )
                submissions = submissions_result.get("studentSubmissions", [])
                
                for submission in submissions:
                    if submission.get("state") == "TURNED_IN":
                        course_submissions += 1
                        total_submissions += 1
                        if submission.get("late"):
                            course_late += 1
                            late_submissions += 1
            
            # Calcular estudiantes en riesgo (menos del 50% de entregas)
            completion_threshold = len(assignments) * 0.5
            for student in students:
                student_submissions = 0
                for assignment in assignments:
                    submissions_result = await data_driver.get_submissions(
                        course["id"], 
                        assignment["id"], 
                        page_size=100
                    )
                    for submission in submissions_result.get("studentSubmissions", []):
                        if (submission.get("userId") == student.get("userId") and 
                            submission.get("state") == "TURNED_IN"):
                            student_submissions += 1
                            break
                
                if student_submissions < completion_threshold:
                    course_at_risk += 1
                    students_at_risk += 1
            
            course_stats.append({
                "courseId": course["id"],
                "courseName": course["name"],
                "totalStudents": course_student_count,
                "totalAssignments": len(assignments),
                "totalSubmissions": course_submissions,
                "lateSubmissions": course_late,
                "studentsAtRisk": course_at_risk,
                "completionRate": round((course_submissions / (course_student_count * len(assignments)) * 100), 1) if course_student_count > 0 and len(assignments) > 0 else 0
            })
        
        return {
            "totalStudents": total_students,
            "totalCourses": total_courses,
            "totalSubmissions": total_submissions,
            "lateSubmissions": late_submissions,
            "studentsAtRisk": students_at_risk,
            "averageCompletionRate": round((total_submissions / (total_students * 2) * 100), 1) if total_students > 0 else 0,  # Asumiendo 2 assignments promedio
            "courseStats": course_stats,
            "period": {
                "startDate": start_date,
                "endDate": end_date
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating academic reports: {str(e)}")

@router.get("/reports/performance")
async def get_performance_reports(
    course_id: Optional[str] = Query(None, description="Filtrar por curso"),
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener reportes de rendimiento"""
    try:
        # Obtener cursos
        courses_result = await data_driver.get_courses(page_size=100)
        courses = courses_result.get("courses", [])
        
        if course_id:
            courses = [c for c in courses if c["id"] == course_id]
        
        performance_data = []
        
        for course in courses:
            # Obtener estudiantes
            students_result = await data_driver.get_students(course["id"], page_size=100)
            students = students_result.get("students", [])
            
            # Obtener assignments
            coursework_result = await data_driver.get_coursework(course["id"], page_size=100)
            assignments = coursework_result.get("courseWork", [])
            
            total_grades = 0
            graded_count = 0
            grade_distribution = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0}
            
            for assignment in assignments:
                submissions_result = await data_driver.get_submissions(
                    course["id"], 
                    assignment["id"], 
                    page_size=100
                )
                
                for submission in submissions_result.get("studentSubmissions", []):
                    if "assignedGrade" in submission and submission["assignedGrade"] is not None:
                        grade = submission["assignedGrade"]
                        total_grades += grade
                        graded_count += 1
                        
                        # Clasificar por letra
                        if grade >= 90:
                            grade_distribution["A"] += 1
                        elif grade >= 80:
                            grade_distribution["B"] += 1
                        elif grade >= 70:
                            grade_distribution["C"] += 1
                        elif grade >= 60:
                            grade_distribution["D"] += 1
                        else:
                            grade_distribution["F"] += 1
            
            average_grade = total_grades / graded_count if graded_count > 0 else 0
            
            performance_data.append({
                "courseId": course["id"],
                "courseName": course["name"],
                "totalStudents": len(students),
                "totalAssignments": len(assignments),
                "averageGrade": round(average_grade, 1),
                "gradeDistribution": grade_distribution,
                "gradedSubmissions": graded_count
            })
        
        return {
            "performanceData": performance_data,
            "overallAverage": round(sum(p["averageGrade"] for p in performance_data) / len(performance_data), 1) if performance_data else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating performance reports: {str(e)}")

@router.get("/reports/attendance")
async def get_attendance_reports(
    course_id: Optional[str] = Query(None, description="Filtrar por curso"),
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener reportes de asistencia (simulado)"""
    try:
        # Obtener cursos
        courses_result = await data_driver.get_courses(page_size=100)
        courses = courses_result.get("courses", [])
        
        if course_id:
            courses = [c for c in courses if c["id"] == course_id]
        
        attendance_data = []
        
        for course in courses:
            # Obtener estudiantes
            students_result = await data_driver.get_students(course["id"], page_size=100)
            students = students_result.get("students", [])
            
            # Simular datos de asistencia (en un sistema real vendría de otra fuente)
            total_sessions = 20  # Simulado
            attendance_rate = 85.5  # Simulado
            
            attendance_data.append({
                "courseId": course["id"],
                "courseName": course["name"],
                "totalStudents": len(students),
                "totalSessions": total_sessions,
                "averageAttendanceRate": attendance_rate,
                "attendanceTrend": "stable"  # Simulado
            })
        
        return {
            "attendanceData": attendance_data,
            "overallAttendanceRate": round(sum(a["averageAttendanceRate"] for a in attendance_data) / len(attendance_data), 1) if attendance_data else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating attendance reports: {str(e)}")

@router.get("/reports/submissions")
async def get_submissions_reports(
    course_id: Optional[str] = Query(None, description="Filtrar por curso"),
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener reportes de entregas"""
    try:
        # Obtener cursos
        courses_result = await data_driver.get_courses(page_size=100)
        courses = courses_result.get("courses", [])
        
        if course_id:
            courses = [c for c in courses if c["id"] == course_id]
        
        submissions_data = []
        
        for course in courses:
            # Obtener estudiantes
            students_result = await data_driver.get_students(course["id"], page_size=100)
            students = students_result.get("students", [])
            
            # Obtener assignments
            coursework_result = await data_driver.get_coursework(course["id"], page_size=100)
            assignments = coursework_result.get("courseWork", [])
            
            total_submissions = 0
            on_time_submissions = 0
            late_submissions = 0
            missing_submissions = 0
            
            for assignment in assignments:
                submissions_result = await data_driver.get_submissions(
                    course["id"], 
                    assignment["id"], 
                    page_size=100
                )
                
                assignment_submissions = submissions_result.get("studentSubmissions", [])
                total_submissions += len(assignment_submissions)
                
                for submission in assignment_submissions:
                    if submission.get("state") == "TURNED_IN":
                        if submission.get("late"):
                            late_submissions += 1
                        else:
                            on_time_submissions += 1
                
                # Calcular entregas faltantes
                missing_submissions += len(students) - len(assignment_submissions)
            
            submissions_data.append({
                "courseId": course["id"],
                "courseName": course["name"],
                "totalStudents": len(students),
                "totalAssignments": len(assignments),
                "totalSubmissions": total_submissions,
                "onTimeSubmissions": on_time_submissions,
                "lateSubmissions": late_submissions,
                "missingSubmissions": missing_submissions,
                "submissionRate": round((total_submissions / (len(students) * len(assignments)) * 100), 1) if len(students) > 0 and len(assignments) > 0 else 0
            })
        
        return {
            "submissionsData": submissions_data,
            "overallSubmissionRate": round(sum(s["submissionRate"] for s in submissions_data) / len(submissions_data), 1) if submissions_data else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating submissions reports: {str(e)}")

@router.get("/reports/cohorts")
async def get_cohorts_reports(
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Obtener reportes por cohortes"""
    try:
        # Obtener cursos (cada curso representa una cohorte)
        courses_result = await data_driver.get_courses(page_size=100)
        courses = courses_result.get("courses", [])
        
        cohorts_data = []
        
        for course in courses:
            # Obtener estudiantes
            students_result = await data_driver.get_students(course["id"], page_size=100)
            students = students_result.get("students", [])
            
            # Obtener assignments
            coursework_result = await data_driver.get_coursework(course["id"], page_size=100)
            assignments = coursework_result.get("courseWork", [])
            
            # Calcular métricas de la cohorte
            total_submissions = 0
            completed_students = 0
            
            for student in students:
                student_submissions = 0
                for assignment in assignments:
                    submissions_result = await data_driver.get_submissions(
                        course["id"], 
                        assignment["id"], 
                        page_size=100
                    )
                    for submission in submissions_result.get("studentSubmissions", []):
                        if (submission.get("userId") == student.get("userId") and 
                            submission.get("state") == "TURNED_IN"):
                            student_submissions += 1
                            total_submissions += 1
                            break
                
                if student_submissions >= len(assignments) * 0.8:  # 80% de completitud
                    completed_students += 1
            
            cohorts_data.append({
                "cohortId": course["id"],
                "cohortName": course["name"],
                "totalStudents": len(students),
                "totalAssignments": len(assignments),
                "completedStudents": completed_students,
                "completionRate": round((completed_students / len(students) * 100), 1) if len(students) > 0 else 0,
                "totalSubmissions": total_submissions
            })
        
        return {
            "cohortsData": cohorts_data,
            "totalCohorts": len(cohorts_data),
            "overallCompletionRate": round(sum(c["completionRate"] for c in cohorts_data) / len(cohorts_data), 1) if cohorts_data else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating cohorts reports: {str(e)}")

@router.get("/reports/export")
async def export_reports(
    format: str = Query("pdf", description="Formato de exportación (pdf, excel, csv)"),
    report_type: str = Query("academic", description="Tipo de reporte (academic, performance, attendance)"),
    course_id: Optional[str] = Query(None, description="Filtrar por curso"),
    data_driver: BaseDataDriver = Depends(get_data_driver)
):
    """Exportar reportes en diferentes formatos"""
    try:
        # Por ahora, simular la exportación
        import os
        import uuid
        from datetime import datetime
        
        # Crear directorio de exports si no existe
        exports_dir = "exports"
        os.makedirs(exports_dir, exist_ok=True)
        
        # Generar nombre de archivo único
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_id = str(uuid.uuid4())[:8]
        
        if format == "pdf":
            filename = f"report_{report_type}_{timestamp}_{file_id}.pdf"
            # Simular generación de PDF
            file_path = os.path.join(exports_dir, filename)
            with open(file_path, "w") as f:
                f.write("PDF Report Content (Simulated)")
            
        elif format == "excel":
            filename = f"report_{report_type}_{timestamp}_{file_id}.xlsx"
            # Simular generación de Excel
            file_path = os.path.join(exports_dir, filename)
            with open(file_path, "w") as f:
                f.write("Excel Report Content (Simulated)")
                
        elif format == "csv":
            filename = f"report_{report_type}_{timestamp}_{file_id}.csv"
            # Simular generación de CSV
            file_path = os.path.join(exports_dir, filename)
            with open(file_path, "w") as f:
                f.write("CSV Report Content (Simulated)")
        else:
            raise HTTPException(status_code=400, detail="Formato no soportado")
        
        return {
            "message": f"Reporte {report_type} exportado exitosamente",
            "format": format,
            "filename": filename,
            "file_url": f"/exports/{filename}",
            "generated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting report: {str(e)}")
