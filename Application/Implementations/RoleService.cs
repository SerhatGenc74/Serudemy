using AutoMapper;
using Contracts.DTO;
using Domain.Entities;
using Repositories.Contracts;
using Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class RoleService : IRoleService
    {
        IRepositoryManager _manager;
        IMapper _mapper;
        public RoleService(IRepositoryManager manager,IMapper mapper) 
        {
            _mapper = mapper;
            _manager = manager;
        }

        public RoleDTO CreateRole(RoleCreateDTO dto)
        {
            var entity = _mapper.Map<Role>(dto);

            _manager.Role.Create(entity);
            _manager.Save();

            return _mapper.Map<RoleDTO>(entity);
        }

        public void DeleteRole()
        {
            throw new NotImplementedException();
        }

        public List<RoleDTO> GetAllRoles()
        {
            var entity = _manager.Role.FindAll(false).ToList();
            return _mapper.Map<List<RoleDTO>>(entity);
        }

        public RoleDTO GetRole(int id)
        {
            var entity = _manager.Role.FindByCondition(x => x.Id == id, false);
            return _mapper.Map<RoleDTO>(entity);
        }

        public RoleDTO UpdateRole(RoleUpdateDTO dto)
        {
          var entity = _mapper.Map<Role>(dto);
            _manager.Role.Update(entity);
            _manager.Save();
            return _mapper.Map<RoleDTO>(entity);
        }
    }
}
