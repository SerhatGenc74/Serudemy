using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Login.Request
{
    public record LoginRequestDTO(string email, string password);
}
