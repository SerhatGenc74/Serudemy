using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Lecture
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public int? CoursesId { get; set; }

    public string? VideoName { get; set; }

    public string? VideoDesc { get; set; }

    public string? VideoUrl { get; set; }
    public int? LectureOrder { get; set; }

    public virtual Course? Courses { get; set; }

    public virtual ICollection<StudentProgress> StudentProgresses { get; set; } = new List<StudentProgress>();
}
