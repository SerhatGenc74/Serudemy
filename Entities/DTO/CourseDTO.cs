using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.DTO
{
    public record CourseDTO
    {
        public int Id { get; init; }

        public int CourseId { get; init; }

        public int? CourseOwnerId { get; init; }

        public string? Name { get; init; }

        public string? Description { get; init; }
        public string? ImageUrl { get; init; }
        public AccountDTO? CourseOwner { get; init; }
    }
}
