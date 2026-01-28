using Application.Contracts;
using AutoMapper;
using Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Application.Implementations
{
    public class ServiceManager : IServiceManager
    {
       private readonly IRepositoryManager _manager;
       private readonly IMapper _mapper;
       private readonly IHttpContextAccessor _httpcontext;
       private readonly IConfiguration _configuration;
        
        public ServiceManager(IRepositoryManager manager, IMapper mapper, IHttpContextAccessor httpcontext, IConfiguration configuration)
       {
           _manager = manager;
           _mapper = mapper;
            _httpcontext = httpcontext;
           _configuration = configuration;

           FileService = new FileService(_manager);
           AccountService = new AccountService(_manager, _mapper);
           AccountRoleService = new AccountRoleService(_manager, _mapper);
           CourseService = new CourseService(_manager, _mapper);
           LectureService = new LectureService(_manager, _mapper);
           RoleService = new RoleService(_manager, _mapper);
           StudentCourse = new StudentCourseService(_manager, _mapper);
           StudentProgress = new StudentProgressService(_mapper, _manager);
           DepartmentService = new DepartmentService(_manager, _mapper);
           FacultyService = new FacultyService(_manager, _mapper);
           CategoryService = new CategoryService(_manager, _mapper);
           
           AuthService = new AuthService(_manager, _mapper, _configuration);
        }
       
       public IFileService FileService { get; }
        public IAuthService AuthService { get; }
       public IAccountService AccountService { get; }
       public IAccountRoleService AccountRoleService { get; }
       public ICourseService CourseService { get; }
       public ILectureService LectureService { get; }
       public IRoleService RoleService { get; }
       public IStudentCourseService StudentCourse { get; }
       public IStudentProgressService StudentProgress { get; }
       public IDepartmentService DepartmentService { get; }
       public IFacultyService FacultyService { get; }
       public ICategoryService CategoryService { get; }
    }
}
