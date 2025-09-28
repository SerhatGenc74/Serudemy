using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class StudentCourse
{
    public int Id { get; set; }

    public int? AccountId { get; set; }

    public int? CoursesId { get; set; }

    public bool? CourseCompleted { get; set; }

    public virtual Account? Account { get; set; }

    public virtual Course? Courses { get; set; }
}
