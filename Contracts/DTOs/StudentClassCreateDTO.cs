using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
    public record StudentClassCreateDTO
    {
        public int? StudentId { get; set; }
        public int? ClassId { get; set; }
        public DateTime? EnrolledAt { get; set; }
    }
}