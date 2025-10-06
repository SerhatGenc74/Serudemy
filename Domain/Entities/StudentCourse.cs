using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class StudentCourse
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int CourseId { get; set; }
        public bool CourseCompleted { get; set; }
        public DateTime EnrolledAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public decimal? Progress { get; set; }

        // Navigation properties
        public virtual Account Account { get; set; } = null!;
        public virtual Course Courses { get; set; } = null!;
    }
}