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
    public class RepositoryManager : IRepositoryManager
    {
        private readonly SerudemyContext _context;
        private IRepositoryBase<Account>? _accountRepository;
        private IRepositoryBase<Role>? _roleRepository;
        private IRepositoryBase<AccountRole>? _accountRoleRepository;
        private IRepositoryBase<Course>? _courseRepository;
        private IRepositoryBase<Lecture>? _lectureRepository;
        private IRepositoryBase<StudentCourse>? _studentCourseRepository;
        private IRepositoryBase<StudentProgress>? _studentProgressRepository;


        public RepositoryManager(SerudemyContext context)
        {
            _context = context;
        }
        public IRepositoryBase<Account> Account =>
        _accountRepository ??= new AccountRepository(_context);

        public IRepositoryBase<Role> Role =>
            _roleRepository ??= new RoleRepository(_context);

        public IRepositoryBase<AccountRole> AccountRole =>
            _accountRoleRepository ??= new AccountRoleRepository(_context);

        public IRepositoryBase<Course> Course =>
            _courseRepository ??= new CourseRepository(_context);

        public IRepositoryBase<Lecture> Lecture =>
            _lectureRepository ??= new LectureRepository(_context);

        public IRepositoryBase<StudentCourse> StudentCourse =>
            _studentCourseRepository ??= new StudentCourseRepository(_context);

        public IRepositoryBase<StudentProgress> StudentProgress =>
            _studentProgressRepository ??= new StudentProgressRepository(_context);

        public void Save() => _context.SaveChanges();


    }
}
