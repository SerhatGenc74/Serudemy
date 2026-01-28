using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.DTOs
{
    public record CategoryDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
    }
}