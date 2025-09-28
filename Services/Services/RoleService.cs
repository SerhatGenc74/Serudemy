using AutoMapper;
using Entities.DTO;
using Entities.Models;
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

        public RoleDTO createRole(RoleCreateDTO dto)
        {
            var entity = _mapper.Map<Role>(dto);

            _manager.Role.Create(entity);
            _manager.Save();

            return _mapper.Map<RoleDTO>(entity);
        }

        public void deleteRole()
        {
            throw new NotImplementedException();
        }

        public List<RoleDTO> getAllRoles()
        {
            var entity = _manager.Role.FindAll(false).ToList();
            return _mapper.Map<List<RoleDTO>>(entity);
        }

        public RoleDTO getRole(int id)
        {
            var entity = _manager.Role.FindByCondition(x => x.Id == id, false);
            return _mapper.Map<RoleDTO>(entity);
        }

        public RoleDTO updateRole(RoleUpdateDTO dto)
        {
          var entity = _mapper.Map<Role>(dto);
            _manager.Role.Update(entity);
            _manager.Save();
            return _mapper.Map<RoleDTO>(entity);
        }
    }
}
