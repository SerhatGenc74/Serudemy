using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.DTO
{
    public record AccountRoleDTO
    {
        public int Id { get; init; }
        public int RoleId { get; init; }
        public int AccountId { get; init; }
        AccountDTO? Account { get; init; }
        AccountRoleDTO? Role { get; init; }
    }
}
