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
        public IQueryable<CourseDTO> GetAllCourseForAdmin(); 
        public CourseDTO GetCourse(int courseId);
        public IQueryable<CourseDTO> GetCoursesByInstructor(int instructorId);
        public Task<int> GenerateUniqueCourseIdAsync();
        public CourseDTO CreateCourse(CourseCreateDTO dto);
        public CourseDTO UpdateCourse(int id,CourseUpdateDTO dto);
        public void DeleteCourse(int id);

        public CourseDTO PublishCourse(int courseId);
        public CourseDTO UnpublishCourse(int courseId);
        public CourseDTO ArchiveCourse(int courseId);
        public CourseDTO SetCourseAccessibility(int courseId, bool isAccessible);
        public IQueryable<CourseDTO> GetPublishedCourses();
        public IQueryable<CourseDTO> GetAccessibleCourses();
        
        // Student-safe methods - Sadece erişilebilir ve yayınlanmış içerikleri döndürür
        public CourseDTO GetCourseForStudent(int courseId);

    }
}
