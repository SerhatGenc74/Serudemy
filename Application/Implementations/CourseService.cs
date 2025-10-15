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
    public class CourseService : ICourseService
    {
        IRepositoryManager _manager;
        IMapper _mapper;

        public CourseService(IRepositoryManager manager,IMapper _mapper)
        {
            this._mapper = _mapper;
            _manager = manager;
        }
        public async Task<int> GenerateUniqueCourseIdAsync()
        {
            var random = new Random();
            int attempts = 0;
            int maxAttempts = 100;

            while (attempts < maxAttempts)
            {
                int candidate = random.Next(1, 999_999_999);
                bool exists = _manager.Course.FindAllByCondition(c=> candidate == c.CourseId,false).Any();

                if (!exists) return candidate;

                attempts++;
            }

            throw new Exception("Uygun CourseId bulunamadı.");
        }
        public IQueryable<CourseDTO> GetCoursesByInstructor(int instructorId)
        {
            var entity = _manager.Course
                .FindAllByCondition(c => c.CourseOwnerId == instructorId, false)
                .Include(c => c.CourseOwner)
                .Include(c => c.Lectures)
                .Include(c => c.TargetDepartment);

            return _mapper.ProjectTo<CourseDTO>(entity);
        }

        public CourseDTO CreateCourse(CourseCreateDTO dto)
        {
            var entity = _mapper.Map<Course>(dto);

            _manager.Course.Create(entity);
            _manager.Save();

            return _mapper.Map<CourseDTO>(entity);
        }

        public void DeleteCourse(int id)
        {
        }

        public IQueryable<CourseDTO> GetAllCourse()
        {
            var entity = _manager.Course
                .FindAll(false)
                .Include(c => c.CourseOwner)
                .Include(c => c.Lectures)
                .Include(c => c.TargetDepartment);

            return _mapper.ProjectTo<CourseDTO>(entity);
        }

        public CourseDTO GetCourse(int courseId)
        {
            var entity = _manager.Course
                .FindAllByCondition(x => x.CourseId == courseId, false)                .Include(c => c.CourseOwner)
                .Include(c => c.Lectures)
                .Include(c => c.TargetDepartment)
                .FirstOrDefault();

            return _mapper.Map<CourseDTO>(entity);
        }

        public IQueryable<CourseDTO> GetCourseWithAccount()
        {
            var entity = _manager.Course
                .FindAll(false)
                .Include(c=>c.CourseOwner);
            

            return _mapper.ProjectTo<CourseDTO>(entity);
        }

        public CourseDTO UpdateCourse(int courseId, CourseUpdateDTO dto)
        {
            // Use trackChanges: true to keep the entity tracked by the context
            var course = _manager.Course.FindByCondition(u => u.CourseId == courseId, true);
            
            if (course == null)
                throw new ArgumentException($"Course with CourseId {courseId} not found.");

            // Map the DTO properties to the existing tracked entity
            // Don't overwrite CourseId as it's the primary key
            course.Name = dto.Name;
            course.Description = dto.Description;
            course.ImageUrl = dto.ImageUrl;
            course.TargetDepartmentId = dto.TargetDepartmentId;
            course.TargetGradeLevel = dto.TargetGradeLevel;
            course.UpdatedAt = dto.UpdatedAt ?? DateTime.Now;

            // No need to call Update() on tracked entities - just save changes
            _manager.Save();

            return _mapper.Map<CourseDTO>(course);

        }

    }
}
