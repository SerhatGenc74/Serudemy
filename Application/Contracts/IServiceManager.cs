using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface IServiceManager
    {
        public IAccountService AccountService { get; }
        public IAccountRoleService AccountRoleService { get; }
        public ICourseService CourseService { get; }
        public ILectureService LectureService { get; }
        public IRoleService RoleService { get; }
        public IStudentCourseService StudentCourse { get; }
        public IStudentProgressService StudentProgress { get; }
        public IFileService FileService { get; }
        public IDepartmentService DepartmentService { get; }
        public IFacultyService FacultyService { get; }
        public ICategoryService CategoryService { get; }
        public IAuthService AuthService { get; }
    }
}
