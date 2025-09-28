using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Serudemy.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DAL
{
    public class CourseRepository : RepositoryBase<Course>
    {
        public CourseRepository(SerudemyContext context) : base(context)
        {
        }
        


    }
}
