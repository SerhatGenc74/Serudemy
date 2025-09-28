using AutoMapper;
using Contracts.DTO;
using Domain.Entities;
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
            var entity = _manager.Course.FindAll(false);

            return _mapper.ProjectTo<CourseDTO>(entity);
        }

        public CourseDTO GetCourse(int courseId)
        {
            var entity = _manager.Course.FindByCondition(x => x.CourseId == courseId, false);

            return _mapper.Map<CourseDTO>(entity);
        }

        public IQueryable<CourseDTO> GetCourseWithAccount()
        {
            var entity = _manager.Course
                .FindAll(false)
                .Include(c=>c.CourseOwner);
            

            return _mapper.ProjectTo<CourseDTO>(entity);
        }

        public CourseDTO UpdateCourse(int id, CourseUpdateDTO dto)
        {
            var course = _manager.Course.FindByCondition(u=>u.Id == id,false);

            _mapper.Map(dto,course);

            _manager.Course.Update(course);
            _manager.Save();

            return _mapper.Map<CourseDTO>(course);

        }

    }
}
