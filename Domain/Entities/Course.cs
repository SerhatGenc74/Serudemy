using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Course
{
    public int Id { get; set; }

    public int CourseId { get; set; }

    public int? CourseOwnerId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CategoryId { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? TargetDepartmentId { get; set; }

    public int? TargetGradeLevel { get; set; }

    public CourseAccessStatus CourseAccessStatus { get; set; } = CourseAccessStatus.Draft;

    public bool IsAccessible { get; set; } = false;

    public virtual Category? Category { get; set; }

    public virtual Account? CourseOwner { get; set; }

    public virtual ICollection<Lecture> Lectures { get; set; } = new List<Lecture>();

    public virtual Department? TargetDepartment { get; set; }
}
