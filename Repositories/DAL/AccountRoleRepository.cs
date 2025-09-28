using Entities.Models;
using Repositories.Contracts;
using Serudemy.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DAL
{
    public class AccountRoleRepository : RepositoryBase<AccountRole>
    {
        public AccountRoleRepository(SerudemyContext context) : base(context)
        {
        }
    }
}
