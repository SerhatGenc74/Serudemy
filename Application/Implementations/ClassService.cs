using Application.Contracts;
using AutoMapper;
using Contracts.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Implementations
{
    public class ClassService : IClassService
    {
        IRepositoryManager _manager;
        IMapper _mapper;

        public ClassService(IRepositoryManager manager, IMapper mapper)
        {
            _manager = manager;
            _mapper = mapper;
        }

        public ClassDTO CreateClass(ClassCreateDTO dto)
        {
            var entity = _mapper.Map<Class>(dto);

            _manager.Class.Create(entity);
            _manager.Save();

            return _mapper.Map<ClassDTO>(entity);
        }

        public void DeleteClass(int id)
        {
            var entity = _manager.Class.FindByCondition(x => x.Id == id, false);
            if (entity != null)
            {
                _manager.Class.Delete(entity);
                _manager.Save();
            }
        }

        public IQueryable<ClassDTO> GetAllClasses()
        {
            var entity = _manager.Class.FindAll(false);
            return _mapper.ProjectTo<ClassDTO>(entity);
        }

        public ClassDTO GetClassById(int id)
        {
            var entity = _manager.Class.FindByCondition(x => x.Id == id, false);
            return _mapper.Map<ClassDTO>(entity);
        }

        public ClassDTO UpdateClass(ClassUpdateDTO dto, int id)
        {
            var entity = _manager.Class.FindByCondition(x => x.Id == id, false);
            if (entity == null)
                return null;

            _mapper.Map(dto, entity);
            _manager.Class.Update(entity);
            _manager.Save();

            return _mapper.Map<ClassDTO>(entity);
        }
    }
}