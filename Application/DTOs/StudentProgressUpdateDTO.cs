using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
    public record StudentProgressUpdateDTO
    {
        public int? AccountId { get; init; }

        public int? LecturesId { get; init; }

        public decimal? ProgressPerc { get; init; }

        public bool? LecturesCompleted { get; init; }

        public int WatchedSeconds { get; init; }
        public int PlaybackPosition { get; init; }
    }
}
