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
    public class StudentCourseRepository : RepositoryBase<StudentCourse>
    {
        public StudentCourseRepository(SerudemyContext context) : base(context)
        {
        }
        
    }
}
