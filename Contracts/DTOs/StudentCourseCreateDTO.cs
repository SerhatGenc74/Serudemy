using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
    public record StudentCourseCreateDTO
    {
        public DateTime? EnrolledAt { get; init; }
        public decimal? Progress { get; init; }
    }
}