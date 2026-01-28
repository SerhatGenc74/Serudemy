using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
    public record StudentCourseUpdateDTO
    {
        public bool? CourseCompleted { get; init; }
        public DateTime? CompletedAt { get; init; }
        public decimal? Progress { get; init; }
    }
}