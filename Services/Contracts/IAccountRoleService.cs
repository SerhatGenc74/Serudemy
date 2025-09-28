using Entities.DTO;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Contracts
{
    public interface IAccountRoleService
    {
        public IQueryable<AccountRoleDTO> GetAllAccountRoles();
        public AccountRoleDTO GetAccountRole();
        public AccountRoleDTO CreateAccountRole(AccountRoleCreateDTO dto);
        public AccountRoleDTO UpdateAccountRole(AccountRoleUpdateDTO dto);
        public void DeleteAccountRole(int id);

    }
}