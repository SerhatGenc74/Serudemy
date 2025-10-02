using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Expressions;
using Infrastructure.Persistence.Repositories;
using Domain.Entities;

namespace Infrastructure.Persistence.Repositories
{
    public class AccountRepository : RepositoryBase<Account>
    {
        public AccountRepository(SerudemyContext context) : base(context)
        {
        }
    }
}