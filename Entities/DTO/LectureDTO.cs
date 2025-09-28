using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.DTO
{
    public record LectureDTO
    {
        public int Id { get; init; }
        public string? Name { get; init; }

        public int? CoursesId { get; init; }

        public string? VideoName { get; init; }

        public string? VideoDesc { get; init; }

        public string? VideoUrl { get; init; }
        public int? LectureOrder { get; init; }
        public CourseDTO? Course { get; init; }
    }
}
