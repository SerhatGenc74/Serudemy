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
    public class LectureRepository : RepositoryBase<Lecture>
    {
        public LectureRepository(SerudemyContext context) : base(context)
        {
        }
       

    }
}
