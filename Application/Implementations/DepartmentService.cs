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
    public class DepartmentService : IDepartmentService
    {
        private readonly IRepositoryManager _manager;
        private readonly IMapper _mapper;

        public DepartmentService(IRepositoryManager manager, IMapper mapper)
        {
            _manager = manager;
            _mapper = mapper;
        }

        public IQueryable<DepartmentDTO> GetAllDepartments()
        {
            var entities = _manager.Department.FindAll(false);
            return _mapper.ProjectTo<DepartmentDTO>(entities);
        }

        public IQueryable<DepartmentDTO> GetDepartmentsByFaculty(int facultyId)
        {
            var entities = _manager.Department.FindAllByCondition(d => d.FacultyId == facultyId, false);
            return _mapper.ProjectTo<DepartmentDTO>(entities);
        }

        public DepartmentDTO GetDepartmentById(int id)
        {
            var entity = _manager.Department.FindByCondition(d => d.Id == id, false);
            return _mapper.Map<DepartmentDTO>(entity);
        }

        public DepartmentDTO CreateDepartment(DepartmentCreateDTO dto)
        {
            var entity = _mapper.Map<Department>(dto);
            
            _manager.Department.Create(entity);
            _manager.Save();

            return _mapper.Map<DepartmentDTO>(entity);
        }

        public DepartmentDTO UpdateDepartment(DepartmentUpdateDTO dto, int id)
        {
            var entity = _manager.Department.FindByCondition(d => d.Id == id, false);
            if (entity == null)
                return null;

            _mapper.Map(dto, entity);
            _manager.Department.Update(entity);
            _manager.Save();

            return _mapper.Map<DepartmentDTO>(entity);
        }

        public void DeleteDepartment(int id)
        {
            var entity = _manager.Department.FindByCondition(d => d.Id == id, false);
            if (entity != null)
            {
                _manager.Department.Delete(entity);
                _manager.Save();
            }
        }
    }
}