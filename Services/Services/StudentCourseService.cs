using AutoMapper;
using Entities.DTO;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class StudentCourseService : IStudentCourseService
    {
        IRepositoryManager _manager;
        IMapper _mapper;

        public StudentCourseService(IRepositoryManager manager, IMapper mapper)
        {
            _manager = manager;
            this._mapper = mapper;
        }

        public void EnrollStudentInCourse(int studentId, int courseId)
        {
            if (IsStudentEnrolledInCourse(studentId, courseId))
                return ;
            var entity = new StudentCourse
            {
                AccountId = studentId,
                CoursesId = courseId,
                CourseCompleted = false,
            };
            _manager.StudentCourse.Create(entity);
            _manager.Save();
        }

        public IQueryable<StudentCourseDTO> GetCoursesByStudent(int studentId)
        {
            var entity = _manager.StudentCourse
                .FindAllByCondition(x => x.AccountId == studentId, false)
                .Include(c=>c.Courses);

            return _mapper.ProjectTo<StudentCourseDTO>(entity);

        }

        public bool IsStudentEnrolledInCourse(int studentId, int courseId)
        {
            var entity = _manager.StudentCourse
                .FindByCondition(x => x.AccountId == studentId && x.CoursesId == courseId, false);
            if(entity != null)
                return true;

            return false;
        }

        public void UnenrollStudentFromCourse(int studentId, int courseId)
        {
            if (!IsStudentEnrolledInCourse(studentId, courseId))
                return;

            var entity = _manager.StudentCourse.FindByCondition(x => x.CoursesId == courseId && x.AccountId == studentId,false);
            _manager.StudentCourse.Delete(entity);
            _manager.Save();

        }
    }
}
