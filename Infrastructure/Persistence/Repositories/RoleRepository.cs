using Domain.Entities;
using Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class RoleRepository : RepositoryBase<Role>
    {
        public RoleRepository(SerudemyContext context) : base(context)
        {
        }
    }
}
