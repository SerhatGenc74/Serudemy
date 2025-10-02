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
    public class RoleService : IRoleService
    {
        private readonly IRepositoryManager _manager;
        private readonly IMapper _mapper;
        
        public RoleService(IRepositoryManager manager, IMapper mapper) 
        {
            _mapper = mapper;
            _manager = manager;
        }

        public List<RoleDTO> GetAllRoles()
        {
            var entities = _manager.Role.FindAll(false).ToList();
            return _mapper.Map<List<RoleDTO>>(entities);
        }

        public RoleDTO GetRole(int id)
        {
            var entity = _manager.Role.FindByCondition(x => x.Id == id, false);
            return _mapper.Map<RoleDTO>(entity);
        }

        public RoleDTO CreateRole(RoleCreateDTO dto)
        {
            var entity = _mapper.Map<Role>(dto);

            _manager.Role.Create(entity);
            _manager.Save();

            return _mapper.Map<RoleDTO>(entity);
        }

        public RoleDTO UpdateRole(RoleUpdateDTO dto, int id)
        {
            var entity = _manager.Role.FindByCondition(r => r.Id == id, false);
            if (entity == null)
                return null;

            _mapper.Map(dto, entity);
            _manager.Role.Update(entity);
            _manager.Save();
            
            return _mapper.Map<RoleDTO>(entity);
        }

        public void DeleteRole(int id)
        {
            var entity = _manager.Role.FindByCondition(r => r.Id == id, false);
            if (entity != null)
            {
                _manager.Role.Delete(entity);
                _manager.Save();
            }
        }
    }
}
