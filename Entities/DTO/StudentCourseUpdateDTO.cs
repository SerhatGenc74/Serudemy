using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.DTO
{
    public record StudentCourseUpdateDTO
    {
        public int? AccountId { get; init; }

        public int? CoursesId { get; init; }

        public bool? CourseCompleted { get; init; }
        public AccountDTO? Account { get; init; }
        public CourseDTO? Course { get; init; }

    }
}
