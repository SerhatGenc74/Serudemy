using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
    public record LectureUpdateDTO
    {
        public string? Name { get; init; }

        public int? CoursesId { get; init; }

        public string? VideoName { get; init; }

        public string? VideoDesc { get; init; }

        public string? VideoUrl { get; init; }
        public int? LectureOrder { get; init; }
        public int? LectureDuration { get; init; }

        public DateTime? CreatedAt { get; init; }

        public DateTime? UpdatedAt { get; init; }
        
        // Schedule (Zamanlama) Özellikleri
        public DateTime? ScheduledPublishDate { get; init; }
        public bool? IsPublished { get; init; }
        
        // Draft/Status Özellikleri güncelleme için controller methodları kullanılacak

    }
}
