using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class StudentProgress
{
    public int Id { get; set; }

    public int? AccountId { get; set; }

    public int? LecturesId { get; set; }

    public decimal? ProgressPerc { get; set; }

    public bool? LecturesCompleted { get; set; }

    public byte[] LastUpdate { get; set; } = null!;

    public int? PlaybackPosition { get; set; }

    public int? WatchedSeconds { get; set; }

    public virtual Account? Account { get; set; }

    public virtual Lecture? Lectures { get; set; }
}
