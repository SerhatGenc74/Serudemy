using Domain.Entities;
using Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class AccountRoleRepository : RepositoryBase<AccountRole>
    {
        public AccountRoleRepository(SerudemyContext context) : base(context)
        {
        }
    }
}
