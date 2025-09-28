using Repositories.Contracts;
using Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class ServiceManager : IServiceManager
    {
        IRepositoryManager _manager;
        public ServiceManager(IRepositoryManager manager)
        {
            _manager = manager;
        }
        public IAccountService accountService { get; }
        public IAccountService AccountRoleService { get; }
        public ICourseService CourseService { get; }
        public ILectureService LectureService { get; }
        public IRoleService RoleService { get; }
        public IStudentCourseService StudentCourse{ get; }
        public IStudentProgressService StudentProgress { get; }

    }
}
