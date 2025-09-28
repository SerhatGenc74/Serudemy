using System;
using System.Collections.Generic;

namespace Entities.Models;

public partial class Course
{
    public int Id { get; set; }

    public int CourseId { get; set; }

    public int? CourseOwnerId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }
    public string? ImageUrl { get; set; }

    public virtual ICollection<StudentCourse> StudentCourses { get; set; } = new List<StudentCourse>();

    public virtual Account? CourseOwner { get; set; }

    public virtual ICollection<Lecture> Lectures { get; set; } = new List<Lecture>();
}
