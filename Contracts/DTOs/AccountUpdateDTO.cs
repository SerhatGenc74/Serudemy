using Contracts.DTOs;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
    public record AccountUpdateDTO
    {
        public int Id { get; init; }

        public string? UserEmail { get; init; }

        public string? Password { get; init; }

        public string? Name { get; init; }

        public string? Surname { get; init; }

        public string? Userno { get; init; }

        public bool? Status { get; init; }

        public DateTime? Birthday { get; init; }

        public string? Gender { get; init; }

        public DateTime? CreatedAt { get; init; }

        public string? FotoPath { get; init; }

        public string? Phone { get; init; }

        public int? GradeLevel { get; init; }

        public int? DepartmentId { get; init; }
        public List<int>? RoleIds { get; init; }
        public DepartmentDTO? Department { get; init; }
    }
}
