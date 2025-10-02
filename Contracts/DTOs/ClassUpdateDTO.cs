using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
    public record ClassUpdateDTO
    {
        public int Id { get; init; }

        public string? Name { get; init; }

        public int? GradeLevel { get; init; }
    }
}
