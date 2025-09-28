using Contracts.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Contracts
{
    public interface IRoleService
    {
        public List<RoleDTO> GetAllRoles();
        public RoleDTO GetRole(int id);
        public RoleDTO CreateRole(RoleCreateDTO dto);
        public RoleDTO UpdateRole(RoleUpdateDTO dto);
        public void DeleteRole();
    }
}
