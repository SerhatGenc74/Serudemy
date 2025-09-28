using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Infrastructure.Repositories
{
    public class CourseRepository : RepositoryBase<Course>
    {
        public CourseRepository(SerudemyContext context) : base(context)
        {
        }
    }
}
