using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTO
{
    public record RoleCreateDTO
    {
        public string? Name { get; init; }
        
    }
}
