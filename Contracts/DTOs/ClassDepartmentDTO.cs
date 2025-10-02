using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
    public record ClassDepartmentDTO
    {
        public int Id { get; init; }

        public int? DepartmentId { get; init; }

        public int? ClassId { get; init; }

        public virtual Class? Class { get; init; }

        public virtual Department? Department { get; init; }
    }
}
