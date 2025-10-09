using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
     public record DepartmentCreateDTO
    {
        public int? FacultyId { get; init; }

        public string? Name { get; init; }

    }
}
