using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Department
{
    public int Id { get; set; }

    public int? FacultyId { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();

    public virtual ICollection<ClassDepartment> ClassDepartments { get; set; } = new List<ClassDepartment>();

    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

    public virtual Faculty? Faculty { get; set; }
}
