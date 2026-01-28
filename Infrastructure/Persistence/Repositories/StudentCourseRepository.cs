using Domain.Entities;
using Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class StudentCourseRepository : RepositoryBase<StudentCourse>
    {
        public StudentCourseRepository(SerudemyContext context) : base(context)
        {
        }
    }
}