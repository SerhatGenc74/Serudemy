using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly SerudemyContext _context;
        // Repository instances
        private IRepositoryBase<Account>? _accountRepository;
        private IRepositoryBase<Role>? _roleRepository;
        private IRepositoryBase<AccountRole>? _accountRoleRepository;
        private IRepositoryBase<Course>? _courseRepository;
        private IRepositoryBase<Lecture>? _lectureRepository;
        private IRepositoryBase<StudentProgress>? _studentProgressRepository;
        private IRepositoryBase<Category>? _categoryRepository;
        private IRepositoryBase<Department>? _departmentRepository;
        private IRepositoryBase<StudentClass>? _studentClassRepository;
        private IRepositoryBase<ClassDepartment>? _classDepartmentRepository;
        private IRepositoryBase<Faculty>? _facultyRepository;
        private IRepositoryBase<Class>? _classRepository;
        private IRepositoryBase<StudentCourse>? _studentCourseRepository;

        public RepositoryManager(SerudemyContext context)
        {
            _context = context;
        }

        #region Repository Properties

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

        public IRepositoryBase<StudentProgress> StudentProgress =>
            _studentProgressRepository ??= new StudentProgressRepository(_context);

        public IRepositoryBase<Category> Category =>
            _categoryRepository ??= new CategoryRepository(_context);

        public IRepositoryBase<Department> Department =>
            _departmentRepository ??= new DepartmentRepository(_context);

        public IRepositoryBase<StudentClass> StudentClass =>
            _studentClassRepository ??= new StudentClassRepository(_context);

        public IRepositoryBase<ClassDepartment> ClassDepartment =>
            _classDepartmentRepository ??= new ClassDepartmentRepository(_context);

        public IRepositoryBase<Faculty> Faculty =>
            _facultyRepository ??= new FacultyRepository(_context);

        public IRepositoryBase<Class> Class =>
            _classRepository ??= new ClassRepository(_context);

        public IRepositoryBase<StudentCourse> StudentCourse =>
            _studentCourseRepository ??= new StudentCourseRepository(_context);

        #endregion

        #region Save Operations

        public void Save()
        {
            _context.SaveChanges();
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
        #endregion
    }
}
