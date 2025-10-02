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
    public class StudentClassService : IStudentClassService
    {
        private readonly IRepositoryManager _manager;
        private readonly IMapper _mapper;

        public StudentClassService(IRepositoryManager manager, IMapper mapper)
        {
            _manager = manager;
            _mapper = mapper;
        }

        public IQueryable<StudentClassDTO> GetAllStudentClasses()
        {
            var entities = _manager.StudentClass.FindAll(false);
            return _mapper.ProjectTo<StudentClassDTO>(entities);
        }

        public StudentClassDTO GetStudentClassById(int id)
        {
            var entity = _manager.StudentClass.FindByCondition(sc => sc.Id == id, false);
            return _mapper.Map<StudentClassDTO>(entity);
        }

        public IQueryable<StudentClassDTO> GetStudentClassesByStudentId(int studentId)
        {
            var entities = _manager.StudentClass.FindAllByCondition(sc => sc.StudentId == studentId, false);
            return _mapper.ProjectTo<StudentClassDTO>(entities);
        }

        public IQueryable<StudentClassDTO> GetStudentClassesByClassId(int classId)
        {
            var entities = _manager.StudentClass.FindAllByCondition(sc => sc.ClassId == classId, false);
            return _mapper.ProjectTo<StudentClassDTO>(entities);
        }

        public StudentClassDTO CreateStudentClass(StudentClassCreateDTO dto)
        {
            var entity = _mapper.Map<StudentClass>(dto);
            
            _manager.StudentClass.Create(entity);
            _manager.Save();

            return _mapper.Map<StudentClassDTO>(entity);
        }

        public StudentClassDTO UpdateStudentClass(StudentClassUpdateDTO dto, int id)
        {
            var entity = _manager.StudentClass.FindByCondition(sc => sc.Id == id, false);
            if (entity == null)
                return null;

            _mapper.Map(dto, entity);
            _manager.StudentClass.Update(entity);
            _manager.Save();

            return _mapper.Map<StudentClassDTO>(entity);
        }

        public void DeleteStudentClass(int id)
        {
            var entity = _manager.StudentClass.FindByCondition(sc => sc.Id == id, false);
            if (entity != null)
            {
                _manager.StudentClass.Delete(entity);
                _manager.Save();
            }
        }
    }
}