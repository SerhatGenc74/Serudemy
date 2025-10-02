using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
     public record DepartmentDTO
    {
        public int Id { get; init; }

        public int? FacultyId { get; init; }

        public string? Name { get; init; }

        public FacultyDTO? Faculty { get; init; }
    }
}
