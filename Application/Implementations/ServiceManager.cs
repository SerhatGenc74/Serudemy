using Application.Contracts;
using AutoMapper;
using Domain.Interfaces;

namespace Application.Implementations
{
    public class ServiceManager : IServiceManager
    {
       private readonly IRepositoryManager _manager;
       private readonly IMapper _mapper;
    
       public ServiceManager(IRepositoryManager manager, IMapper mapper)
       {
           _manager = manager;
           _mapper = mapper;
    
           FileService = new FileService(_manager);
           AccountService = new AccountService(_manager, _mapper);
           AccountRoleService = new AccountRoleService(_manager, _mapper);
           CourseService = new CourseService(_manager, _mapper);
           LectureService = new LectureService(_manager, _mapper);
           RoleService = new RoleService(_manager, _mapper);
           StudentCourse = new StudentCourseService(_manager, _mapper);
           StudentProgress = new StudentProgressService(_mapper, _manager);
           ClassService = new ClassService(_manager, _mapper);
           DepartmentService = new DepartmentService(_manager, _mapper);
           FacultyService = new FacultyService(_manager, _mapper);
           ClassDepartmentService = new ClassDepartmentService(_manager, _mapper);
           CategoryService = new CategoryService(_manager, _mapper);
           StudentClassService = new StudentClassService(_manager, _mapper);
       }
       
       public IFileService FileService { get; }
       public IAccountService AccountService { get; }
       public IAccountRoleService AccountRoleService { get; }
       public ICourseService CourseService { get; }
       public ILectureService LectureService { get; }
       public IRoleService RoleService { get; }
       public IStudentCourseService StudentCourse { get; }
       public IStudentProgressService StudentProgress { get; }
       public IClassService ClassService { get; }
       public IDepartmentService DepartmentService { get; }
       public IFacultyService FacultyService { get; }
       public IClassDepartmentService ClassDepartmentService { get; }
       public ICategoryService CategoryService { get; }
       public IStudentClassService StudentClassService { get; }
    }

}
