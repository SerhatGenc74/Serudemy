using Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface ICourseService
    {
        public IQueryable<CourseDTO> GetCourseWithAccount();
        public IQueryable<CourseDTO> GetAllCourse();
        public CourseDTO GetCourse(int courseId);
        public IQueryable<CourseDTO> GetCoursesByInstructor(int instructorId);
        public Task<int> GenerateUniqueCourseIdAsync();
        public CourseDTO CreateCourse(CourseCreateDTO dto);
        public CourseDTO UpdateCourse(int id,CourseUpdateDTO dto);
        public void DeleteCourse(int id);

    }
}
