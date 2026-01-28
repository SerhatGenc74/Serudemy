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

    public DateTime? Birthday { get; set; }

    public string? Gender { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? FotoPath { get; set; }

    public string? Phone { get; set; }

    public int? GradeLevel { get; set; }

    public int? DepartmentId { get; set; }

    public virtual ICollection<AccountRole> AccountRoles { get; set; } = new List<AccountRole>();

    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

    public virtual Department? Department { get; set; }

    public virtual ICollection<StudentClass> StudentClasses { get; set; } = new List<StudentClass>();

    public virtual ICollection<StudentProgress> StudentProgresses { get; set; } = new List<StudentProgress>();
}
