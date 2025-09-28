using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.DTO
{
    public record AccountUpdateDTO
    {
        public int? Id { get; init; }
        public string? UserEmail { get; init; }

        public string? Password { get; init; }

        public string? Name { get; init; }

        public string? Surname { get; init; }

        public string? Userno { get; init; }

        public bool? Status { get; init; }
    }
}
