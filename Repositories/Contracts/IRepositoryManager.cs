using Entities.Models;
using Repositories.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Contracts
{
    public interface IRepositoryManager
    {
        IRepositoryBase<Account> Account { get; }
        IRepositoryBase<Role> Role { get; }
        IRepositoryBase<AccountRole> AccountRole { get; }
        IRepositoryBase<Course> Course { get; }
        IRepositoryBase<Lecture> Lecture { get; }
        IRepositoryBase<StudentCourse> StudentCourse { get; }
        IRepositoryBase<StudentProgress> StudentProgress { get; }
        void Save();
    }
}
