using AutoMapper;
using Repositories.Contracts;
using Services.Contracts;
using Services.Services;

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
        StudentProgress = new StudentProgressService(_mapper,_manager);
    }
    public IFileService FileService { get; }
    public IAccountService AccountService { get; }
    public IAccountRoleService AccountRoleService { get; }
    public ICourseService CourseService { get; }
    public ILectureService LectureService { get; }
    public IRoleService RoleService { get; }
    public IStudentCourseService StudentCourse { get; }
    public IStudentProgressService StudentProgress { get; }
}