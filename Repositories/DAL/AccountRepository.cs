using Repositories.Contracts;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Expressions;
using Serudemy.DAL;

namespace Repositories.DAL
{
    public class AccountRepository : RepositoryBase<Entities.Models.Account>
    {
        public AccountRepository(SerudemyContext context) : base(context)
        {
        }
    }
}