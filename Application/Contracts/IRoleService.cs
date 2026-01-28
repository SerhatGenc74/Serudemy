using Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface IRoleService
    {
        public List<RoleDTO> GetAllRoles();
        public RoleDTO GetRole(int id);
        public RoleDTO CreateRole(RoleCreateDTO dto);
        public RoleDTO UpdateRole(RoleUpdateDTO dto, int id);
        public void DeleteRole(int id);
    }
}
