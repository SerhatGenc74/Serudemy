using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTO
{
    public record AccountRoleCreateDTO
    {
        public int? AccountId { get; init; }

        public int? RoleId { get; init; }

        public AccountDTO? Account { get; init; }
        public RoleDTO? Role { get; init; }
    }
}
