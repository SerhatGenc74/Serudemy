using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class ClassDepartment
{
    public int Id { get; set; }

    public int? DepartmentId { get; set; }

    public int? ClassId { get; set; }

    public virtual Class? Class { get; set; }

    public virtual Department? Department { get; set; }
}
