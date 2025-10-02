using Application.Contracts;
using AutoMapper;
using Contracts.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Implementations
{
    public class StudentCourseService : IStudentCourseService
    {
        private readonly IRepositoryManager _manager;
        private readonly IMapper _mapper;

        public StudentCourseService(IRepositoryManager manager, IMapper mapper)
        {
            _manager = manager;
            _mapper = mapper;
        }

        public IQueryable<StudentCourseDTO> GetAllStudentCourses()
        {
            var entities = _manager.StudentCourse.FindAll(false);
            return _mapper.ProjectTo<StudentCourseDTO>(entities);
        }

        public StudentCourseDTO GetStudentCourseById(int id)
        {
            var entity = _manager.StudentCourse.FindByCondition(sc => sc.Id == id, false);
            return _mapper.Map<StudentCourseDTO>(entity);
        }

        public IQueryable<StudentCourseDTO> GetCoursesByStudent(int studentId)
        {
            var entities = _manager.StudentCourse
                .FindAllByCondition(x => x.AccountId == studentId, false)
                .Include(c => c.Courses);

            return _mapper.ProjectTo<StudentCourseDTO>(entities);
        }

        public IQueryable<StudentCourseDTO> GetStudentsByCourse(int courseId)
        {
            var entities = _manager.StudentCourse
                .FindAllByCondition(x => x.CoursesId == courseId, false)
                .Include(a => a.Account);

            return _mapper.ProjectTo<StudentCourseDTO>(entities);
        }

        public StudentCourseDTO EnrollStudentInCourse(int studentId, int courseId, StudentCourseCreateDTO dto)
        {
            var entity = _mapper.Map<StudentCourse>(dto);
            entity.AccountId = studentId;
            entity.CoursesId = courseId;
            entity.CourseCompleted = false;
            entity.EnrolledAt = dto.EnrolledAt ?? DateTime.Now;
            
            _manager.StudentCourse.Create(entity);
            _manager.Save();

            return _mapper.Map<StudentCourseDTO>(entity);
        }

        public StudentCourseDTO CreateStudentCourse(StudentCourseCreateDTO dto)
        {
            var entity = _mapper.Map<StudentCourse>(dto);
            entity.CourseCompleted = false;
            entity.EnrolledAt = dto.EnrolledAt ?? DateTime.Now;

            _manager.StudentCourse.Create(entity);
            _manager.Save();

            return _mapper.Map<StudentCourseDTO>(entity);
        }

        public StudentCourseDTO UpdateStudentCourse(StudentCourseUpdateDTO dto, int id)
        {
            var entity = _manager.StudentCourse.FindByCondition(sc => sc.Id == id, false);
            if (entity == null)
                return null;

            _mapper.Map(dto, entity);
            _manager.StudentCourse.Update(entity);
            _manager.Save();

            return _mapper.Map<StudentCourseDTO>(entity);
        }

        public void DeleteStudentCourse(int id)
        {
            var entity = _manager.StudentCourse.FindByCondition(sc => sc.Id == id, false);
            if (entity != null)
            {
                _manager.StudentCourse.Delete(entity);
                _manager.Save();
            }
        }

        public bool IsStudentEnrolledInCourse(int studentId, int courseId)
        {
            var entity = _manager.StudentCourse
                .FindByCondition(x => x.AccountId == studentId && x.CoursesId == courseId, false);
            return entity != null;
        }

        public bool UnenrollStudentFromCourse(int studentId, int courseId)
        {
            if (!IsStudentEnrolledInCourse(studentId, courseId))
                return false;

            var entity = _manager.StudentCourse.FindByCondition(x => x.CoursesId == courseId && x.AccountId == studentId, false);
            if (entity != null)
            {
                _manager.StudentCourse.Delete(entity);
                _manager.Save();
                return true;
            }
            return false;
        }
    }
}

