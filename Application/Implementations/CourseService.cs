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
            // Get only accessible and published courses (for students)
            var entity = _manager.Course
                .FindAllByCondition(c => c.IsAccessible && c.CourseAccessStatus == CourseAccessStatus.Published, false)
                .Include(c => c.CourseOwner)
                .Include(c => c.Lectures)
                .Include(c => c.TargetDepartment);

            return _mapper.ProjectTo<CourseDTO>(entity);
        }

        public IQueryable<CourseDTO> GetAllCourseForAdmin()
        {
            // Get all courses regardless of status (for admins/teachers)
            var entity = _manager.Course
                .FindAll(false)
                .Include(c => c.CourseOwner)
                .Include(c => c.Lectures)
                .Include(c => c.TargetDepartment);

            return _mapper.ProjectTo<CourseDTO>(entity);
        }

        public CourseDTO GetCourse(int courseId)
        {
            // NOT: Bu metod tüm kursları döndürür (öğretmen/admin için)
            // Öğrenciler için GetAllCourse veya GetAccessibleCourses kullanılmalı
            // courseId parametresi ile hem Id hem de CourseId'ye göre arama yap
            var entity = _manager.Course
                .FindAllByCondition(x => x.Id == courseId || x.CourseId == courseId, false)
                .Include(c => c.CourseOwner)
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
            var course = _manager.Course.FindByCondition(u => u.Id == courseId, true);
            
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

            // Update new course access control fields
            if (!string.IsNullOrWhiteSpace(dto.CourseAccessStatus) && 
                Enum.TryParse<CourseAccessStatus>(dto.CourseAccessStatus, true, out var accessStatus))
            {
                course.CourseAccessStatus = accessStatus;
            }
            
            if (dto.IsAccessible.HasValue)
            {
                course.IsAccessible = dto.IsAccessible.Value;
            }

            // No need to call Update() on tracked entities - just save changes
            _manager.Save();

            return _mapper.Map<CourseDTO>(course);

        }

        public CourseDTO PublishCourse(int courseId)
        {
            var course = _manager.Course.FindByCondition(u => u.Id == courseId, true);
            
            if (course == null)
                throw new ArgumentException($"Course with CourseId {courseId} not found.");

            course.CourseAccessStatus = CourseAccessStatus.Published;
            course.IsAccessible = true;
            course.UpdatedAt = DateTime.Now;

            _manager.Save();

            return _mapper.Map<CourseDTO>(course);
        }

        public CourseDTO UnpublishCourse(int courseId)
        {
            var course = _manager.Course.FindByCondition(u => u.Id == courseId, true);
            
            if (course == null)
                throw new ArgumentException($"Course with CourseId {courseId} not found.");

            course.CourseAccessStatus = CourseAccessStatus.Draft;
            course.IsAccessible = false;
            course.UpdatedAt = DateTime.Now;

            _manager.Save();

            return _mapper.Map<CourseDTO>(course);
        }

        public CourseDTO ArchiveCourse(int courseId)
        {
            var course = _manager.Course.FindByCondition(u => u.Id == courseId, true);
            
            if (course == null)
                throw new ArgumentException($"Course with CourseId {courseId} not found.");

            course.CourseAccessStatus = CourseAccessStatus.Archived;
            course.IsAccessible = false;
            course.UpdatedAt = DateTime.Now;

            _manager.Save();

            return _mapper.Map<CourseDTO>(course);
        }

        public CourseDTO SetCourseAccessibility(int courseId, bool isAccessible)
        {
            var course = _manager.Course.FindByCondition(u => u.Id == courseId, true);
            
            if (course == null)
                throw new ArgumentException($"Course with CourseId {courseId} not found.");

            course.IsAccessible = isAccessible;
            course.UpdatedAt = DateTime.Now;

            _manager.Save();

            return _mapper.Map<CourseDTO>(course);
        }

        public IQueryable<CourseDTO> GetPublishedCourses()
        {
            var entity = _manager.Course
                .FindAllByCondition(c => c.CourseAccessStatus == CourseAccessStatus.Published, false)
                .Include(c => c.CourseOwner)
                .Include(c => c.Lectures)
                .Include(c => c.TargetDepartment);

            return _mapper.ProjectTo<CourseDTO>(entity);
        }

        public IQueryable<CourseDTO> GetAccessibleCourses()
        {
            var entity = _manager.Course
                .FindAllByCondition(c => c.IsAccessible && c.CourseAccessStatus == CourseAccessStatus.Published, false)
                .Include(c => c.CourseOwner)
                .Include(c => c.Lectures)
                .Include(c => c.TargetDepartment);

            return _mapper.ProjectTo<CourseDTO>(entity);
        }

        // Öğrenciler için tek bir kursu güvenli şekilde getir
        public CourseDTO GetCourseForStudent(int courseId)
        {
            var entity = _manager.Course
                .FindAllByCondition(c => 
                    (c.Id == courseId || c.CourseId == courseId) && 
                    c.IsAccessible == true && 
                    c.CourseAccessStatus == CourseAccessStatus.Published, false)
                .Include(c => c.CourseOwner)
                .Include(c => c.Lectures)
                .Include(c => c.TargetDepartment)
                .FirstOrDefault();

            return _mapper.Map<CourseDTO>(entity);
        }

    }
}
