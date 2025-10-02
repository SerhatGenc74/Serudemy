using Contracts.DTOs;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
    public record ClassDepartmentCreateDTO
    {
        public int? DepartmentId { get; init; }

        public int? ClassId { get; init; }

        public  ClassDTO? Class { get; init; }

        public DepartmentDTO? Department { get; init; }
    }
}
