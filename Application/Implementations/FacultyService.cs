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
    public class FacultyService : IFacultyService
    {
        private readonly IRepositoryManager _manager;
        private readonly IMapper _mapper;

        public FacultyService(IRepositoryManager manager, IMapper mapper)
        {
            _manager = manager;
            _mapper = mapper;
        }

        public IQueryable<FacultyDTO> GetAllFaculties()
        {
            var entities = _manager.Faculty.FindAll(false);
            return _mapper.ProjectTo<FacultyDTO>(entities);
        }

        public FacultyDTO GetFacultyById(int id)
        {
            var entity = _manager.Faculty.FindByCondition(f => f.Id == id, false);
            return _mapper.Map<FacultyDTO>(entity);
        }

        public FacultyDTO CreateFaculty(FacultyCreateDTO dto)
        {
            var entity = _mapper.Map<Faculty>(dto);
            
            _manager.Faculty.Create(entity);
            _manager.Save();

            return _mapper.Map<FacultyDTO>(entity);
        }

        public FacultyDTO UpdateFaculty(FacultyUpdateDTO dto, int id)
        {
            var entity = _manager.Faculty.FindByCondition(f => f.Id == id, false);
            if (entity == null)
                return null;

            _mapper.Map(dto, entity);
            _manager.Faculty.Update(entity);
            _manager.Save();

            return _mapper.Map<FacultyDTO>(entity);
        }

        public void DeleteFaculty(int id)
        {
            var entity = _manager.Faculty.FindByCondition(f => f.Id == id, false);
            if (entity != null)
            {
                _manager.Faculty.Delete(entity);
                _manager.Save();
            }
        }
    }
}