using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Account
{
    public int Id { get; set; }

    public string? UserEmail { get; set; }

    public string? Password { get; set; }

    public string? Name { get; set; }

    public string? Surname { get; set; }

    public string? Userno { get; set; }

    public bool? Status { get; set; }

    public virtual ICollection<StudentCourse> StudentCourses { get; set; } = new List<StudentCourse>();

    public virtual ICollection<AccountRole> AccountRoles { get; set; } = new List<AccountRole>();

    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

    public virtual ICollection<StudentProgress> StudentProgresses { get; set; } = new List<StudentProgress>();
}
