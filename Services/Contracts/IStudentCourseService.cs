using Entities.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Contracts
{
    public interface IStudentCourseService
    {
        public void EnrollStudentInCourse(int studentId, int courseId);
        public bool IsStudentEnrolledInCourse(int studentId, int courseId);
        public void UnenrollStudentFromCourse(int studentId, int courseId);
        public IQueryable<StudentCourseDTO> GetCoursesByStudent(int studentId); 
    }
}
