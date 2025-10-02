using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
    public record StudentClassDTO
    {
        public int Id { get; set; }
        public int? StudentId { get; set; }
        public int? ClassId { get; set; }
        public DateTime? EnrolledAt { get; set; }
        public ClassDTO? Class { get; set; }
        public AccountDTO? Student { get; set; }
    }
}