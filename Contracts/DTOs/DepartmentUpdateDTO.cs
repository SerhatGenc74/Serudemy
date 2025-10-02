﻿using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
     public record DepartmentUpdateDTO
    {
        public int? FacultyId { get; init; }

        public string? Name { get; init; }

        public virtual FacultyDTO? Faculty { get; init; }
    }
}
