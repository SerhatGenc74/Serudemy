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
            var entities = _manager.StudentCourse
                .FindAll(false)
                .Include(c => c.Account)
                .Include(c => c.Courses);

            return _mapper.ProjectTo<StudentCourseDTO>(entities);
        }
       
        public StudentCourseDTO GetStudentCourseById(int id)
        {
            var entity = _manager.StudentCourse
                .FindAllByCondition(sc => sc.Id == id, false)
                .Include(c => c.Account)
                .Include(c => c.Courses)
                .FirstOrDefault();

            return _mapper.Map<StudentCourseDTO>(entity);
        }

        public IQueryable<StudentCourseDTO> GetCoursesByStudent(int studentId)
        {
            var entities = _manager.StudentCourse
                .FindAllByCondition(x => x.AccountId == studentId, false)
                .Include(c => c.Courses)
                .Include(a => a.Account);

            return _mapper.ProjectTo<StudentCourseDTO>(entities);
        }
       

        public IQueryable<StudentCourseDTO> GetStudentsByCourse(int courseId)
        {
            var entities = _manager.StudentCourse
                .FindAllByCondition(x => x.CourseId == courseId, false)
                .Include(a => a.Account);

            return _mapper.ProjectTo<StudentCourseDTO>(entities);
        }

        public StudentCourseDTO EnrollStudentInCourse(int studentId, int courseId, StudentCourseCreateDTO dto)
        {
            var entity = _mapper.Map<StudentCourse>(dto);
            entity.AccountId = studentId;
            entity.CourseId = courseId;
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
                .FindByCondition(x => x.AccountId == studentId && x.CourseId == courseId, false);
            if (entity != null)
            {
                return true;
            }
            return false;
        }

        public bool UnenrollStudentFromCourse(int studentId, int courseId)
        {
            if (!IsStudentEnrolledInCourse(studentId, courseId))
                return false;

            var entity = _manager.StudentCourse.FindByCondition(x => x.CourseId == courseId && x.AccountId == studentId, false);
            if (entity != null)
            {
                _manager.StudentCourse.Delete(entity);
                _manager.Save();
                return true;
            }
            return false;
        }

        public IQueryable<StudentCourseDTO> GetStudentCoursesByCourse(int courseId)
        {
            var entities = _manager.StudentCourse
                .FindAllByCondition(x => x.CourseId == courseId, false)
                .Include(c => c.Account)
                .Include(c => c.Courses);

            return _mapper.ProjectTo<StudentCourseDTO>(entities);
        }

        public IQueryable<object> GetEligibleStudentsForCourse(int courseId)
        {
            // Önce kurs bilgilerini al
            var course = _manager.Course.FindByCondition(c => c.CourseId == courseId, false);

            if (course == null)
                throw new ArgumentException("Course not found");

            // Zaten kursa kayıtlı öğrencilerin ID'lerini al
            var enrolledStudentIds = _manager.StudentCourse
                .FindAllByCondition(sc => sc.CourseId == courseId, false)
                .Select(sc => sc.AccountId)
                .ToList();

            // Sadece rolü 'Student' olan, grade/department uygun ve henüz kursa kayıtlı olmayanları getir
            var eligibleStudents = _manager.Account
                .FindAllByCondition(a => a.GradeLevel == course.TargetGradeLevel && 
                                        a.DepartmentId == course.TargetDepartmentId &&
                                        !enrolledStudentIds.Contains(a.Id), false)
                .Join(_manager.AccountRole.FindAll(false),
                      a => a.Id,
                      ar => ar.AccountId,
                      (a, ar) => new { Account = a, AccountRole = ar })
                .Join(_manager.Role.FindAll(false),
                      aar => aar.AccountRole.RoleId,
                      r => r.Id,
                      (aar, r) => new { aar.Account, Role = r })
                .Where(x => x.Role.Name == "Student")
                .Select(s => new
                {
                    id = s.Account.Id,
                    name = s.Account.Name,
                    surname = s.Account.Surname,
                    userno = s.Account.Userno,
                    email = s.Account.UserEmail,
                    gradeLevel = s.Account.GradeLevel,
                    departmentId = s.Account.DepartmentId
                });

            return eligibleStudents;
        }
    }
}

