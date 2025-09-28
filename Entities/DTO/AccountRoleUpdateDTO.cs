using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.DTO
{
    public record AccountRoleUpdateDTO
    {
        public int? RoleId { get; init; }
        public int? AccountId { get; init; }
        public AccountDTO? Account { get; init; }
        public RoleDTO? Role { get; init; }

    }
}
