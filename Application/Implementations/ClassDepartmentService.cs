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
    public class ClassDepartmentService : IClassDepartmentService
    {
        private readonly IRepositoryManager _manager;
        private readonly IMapper _mapper;

        public ClassDepartmentService(IRepositoryManager manager, IMapper mapper)
        {
            _manager = manager;
            _mapper = mapper;
        }

        public IQueryable<ClassDepartmentDTO> GetAllClassDepartments()
        {
            var entities = _manager.ClassDepartment.FindAll(false);
            return _mapper.ProjectTo<ClassDepartmentDTO>(entities);
        }

        public ClassDepartmentDTO GetClassDepartmentById(int id)
        {
            var entity = _manager.ClassDepartment.FindByCondition(cd => cd.Id == id, false);
            return _mapper.Map<ClassDepartmentDTO>(entity);
        }

        public IQueryable<ClassDepartmentDTO> GetClassDepartmentsByDepartmentId(int departmentId)
        {
            var entities = _manager.ClassDepartment.FindAllByCondition(cd => cd.DepartmentId == departmentId, false);
            return _mapper.ProjectTo<ClassDepartmentDTO>(entities);
        }

        public IQueryable<ClassDepartmentDTO> GetClassDepartmentsByClassId(int classId)
        {
            var entities = _manager.ClassDepartment.FindAllByCondition(cd => cd.ClassId == classId, false);
            return _mapper.ProjectTo<ClassDepartmentDTO>(entities);
        }

        public ClassDepartmentDTO CreateClassDepartment(ClassDepartmentCreateDTO dto)
        {
            var entity = _mapper.Map<ClassDepartment>(dto);
            
            _manager.ClassDepartment.Create(entity);
            _manager.Save();

            return _mapper.Map<ClassDepartmentDTO>(entity);
        }

        public ClassDepartmentDTO UpdateClassDepartment(ClassDepartmentUpdateDTO dto, int id)
        {
            var entity = _manager.ClassDepartment.FindByCondition(cd => cd.Id == id, false);
            if (entity == null)
                return null;

            _mapper.Map(dto, entity);
            _manager.ClassDepartment.Update(entity);
            _manager.Save();

            return _mapper.Map<ClassDepartmentDTO>(entity);
        }

        public void DeleteClassDepartment(int id)
        {
            var entity = _manager.ClassDepartment.FindByCondition(cd => cd.Id == id, false);
            if (entity != null)
            {
                _manager.ClassDepartment.Delete(entity);
                _manager.Save();
            }
        }
    }
}