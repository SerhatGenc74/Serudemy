using Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface IStudentCourseService
    {
        public IQueryable<StudentCourseDTO> GetAllStudentCourses();
        public StudentCourseDTO GetStudentCourseById(int id);
        public IQueryable<StudentCourseDTO> GetCoursesByStudent(int studentId);
        public IQueryable<StudentCourseDTO> GetStudentsByCourse(int courseId);
        public IQueryable<StudentCourseDTO> GetStudentCoursesByCourse(int courseId);
        public IQueryable<object> GetEligibleStudentsForCourse(int courseId);
        public StudentCourseDTO EnrollStudentInCourse(int studentId, int courseId, StudentCourseCreateDTO dto);
        public StudentCourseDTO CreateStudentCourse(StudentCourseCreateDTO dto);
        public StudentCourseDTO UpdateStudentCourse(StudentCourseUpdateDTO dto, int id);
        public void DeleteStudentCourse(int id);
        public bool IsStudentEnrolledInCourse(int studentId, int courseId);
        public bool UnenrollStudentFromCourse(int studentId, int courseId);
    }
}
