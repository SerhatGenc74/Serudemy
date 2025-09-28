using Domain.Entities;
using Repositories.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Infrastructure.Repositories
{
    public class RoleRepository : RepositoryBase<Role>
    {
        public RoleRepository(SerudemyContext context) : base(context)
        {
        }
    }
}
