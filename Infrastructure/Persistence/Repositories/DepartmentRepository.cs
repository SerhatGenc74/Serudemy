using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class DepartmentRepository : RepositoryBase<Department>
    {
        public DepartmentRepository(SerudemyContext context) :base(context)
        {
        }
    }
}
