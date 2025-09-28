using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Contracts
{
    public interface IServiceManager
    {
        public IAccountService accountService { get; }
        public IAccountService AccountRoleService { get; }
        public ICourseService CourseService { get; }
        public ILectureService LectureService { get; }
        public IRoleService RoleService { get; }
        public IStudentCourseService StudentCourse { get; }
        public IStudentProgressService StudentProgress { get; }
    }
}
