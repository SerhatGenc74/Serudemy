using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class StudentProgressRepository : RepositoryBase<StudentProgress>
    {
        public StudentProgressRepository(SerudemyContext context) : base(context)
        {

        }
       
        
        
    }
}
