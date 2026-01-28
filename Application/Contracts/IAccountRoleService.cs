using Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface IAccountRoleService
    {
        public IQueryable<AccountRoleDTO> GetAllAccountRoles();
        public AccountRoleDTO GetAccountRoleById(int id);
        public IQueryable<AccountRoleDTO> GetAccountRolesByAccountId(int accountId);
        public IQueryable<AccountRoleDTO> GetAccountRolesByRoleId(int roleId);
        public AccountRoleDTO CreateAccountRole(AccountRoleCreateDTO dto);
        public AccountRoleDTO UpdateAccountRole(AccountRoleUpdateDTO dto, int id);
        public void DeleteAccountRole(int id);
    }
}