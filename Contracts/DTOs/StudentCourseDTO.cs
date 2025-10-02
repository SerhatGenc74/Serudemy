using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
    public record StudentCourseDTO
    {
        public int Id { get; init; }
        public int AccountId { get; init; }
        public int CoursesId { get; init; }
        public bool CourseCompleted { get; init; }
        public DateTime EnrolledAt { get; init; }
        public DateTime? CompletedAt { get; init; }
        public decimal? Progress { get; init; }
        public string? AccountName { get; init; }
        public string? CourseName { get; init; }
    }
}