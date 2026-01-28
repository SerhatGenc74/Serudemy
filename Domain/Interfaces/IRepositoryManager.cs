using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IRepositoryManager
    {
        IRepositoryBase<Account> Account { get; }
        IRepositoryBase<Role> Role { get; }
        IRepositoryBase<AccountRole> AccountRole { get; }
        IRepositoryBase<Course> Course { get; }
        IRepositoryBase<Lecture> Lecture { get; }
        IRepositoryBase<StudentProgress> StudentProgress { get; }
        IRepositoryBase<Category> Category { get; }
        IRepositoryBase<Department> Department { get; }
        IRepositoryBase<StudentClass> StudentClass { get; } 
        IRepositoryBase<ClassDepartment> ClassDepartment { get; }
        IRepositoryBase<Faculty> Faculty { get; }
        IRepositoryBase<Class> Class { get; }
        IRepositoryBase<StudentCourse> StudentCourse { get; }

        // Synchronous Save
        void Save();
        
        // Asynchronous Save
        Task SaveAsync();
        
    }
}
