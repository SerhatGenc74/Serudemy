using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
    public record RoleUpdateDTO
    {
        public string? Name { get; init; }
    }
}
