using Repositories.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Expressions;
using Domain.Entities;

namespace Repositories.Infrastructure.Repositories
{
    public class AccountRepository : RepositoryBase<Account>
    {
        public AccountRepository(SerudemyContext context) : base(context)
        {
        }
    }
}