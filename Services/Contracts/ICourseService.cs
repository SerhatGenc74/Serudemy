using Entities.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Contracts
{
    public interface ICourseService
    {
        public IQueryable<CourseDTO> GetCourseWithAccount();
        public IQueryable<CourseDTO> GetAllCourse();
        public CourseDTO GetCourse(int courseId);
        public CourseDTO CreateCourse(CourseCreateDTO dto);
        public CourseDTO UpdateCourse(int id,CourseUpdateDTO dto);
        public void DeleteCourse(int id);

    }
}
