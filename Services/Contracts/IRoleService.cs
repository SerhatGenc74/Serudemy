using Entities.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Contracts
{
    public interface IRoleService
    {
        public List<RoleDTO> getAllRoles();
        public RoleDTO getRole(int id);
        public RoleDTO createRole(RoleCreateDTO dto);
        public RoleDTO updateRole(RoleUpdateDTO dto);
        public void deleteRole();
    }
}
