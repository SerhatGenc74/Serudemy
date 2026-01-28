using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
    public record CourseCreateDTO
    {
        public int CourseId { get; init; }

        public int? CourseOwnerId { get; init; }

        public string? Name { get; init; }

        public string? Description { get; init; }
        public string? ImageUrl { get; init; }
        public DateTime? CreatedAt { get; init; }

        public int? CategoryId { get; init; }

        public DateTime? UpdatedAt { get; init; }

        public int? TargetDepartmentId { get; init; }

        public int? TargetGradeLevel { get; init; }

        public string? CourseAccessStatus { get; init; }

        public bool IsAccessible { get; init; }
    }
}
