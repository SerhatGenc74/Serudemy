using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class StudentClass
{
    public int Id { get; set; }

    public int? StudentId { get; set; }

    public int? ClassId { get; set; }

    public DateTime? EnrolledAt { get; set; }

    public virtual Class? Class { get; set; }

    public virtual Account? Student { get; set; }
}
