using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Class
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public int? GradeLevel { get; set; }

    public virtual ICollection<ClassDepartment> ClassDepartments { get; set; } = new List<ClassDepartment>();

    public virtual ICollection<StudentClass> StudentClasses { get; set; } = new List<StudentClass>();
}
