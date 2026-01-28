using AutoMapper;
using Contracts.DTOs;
using Domain.Entities;

namespace Serudemy.Utilities.AutoMapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AccountCreateDTO, Account>();
            CreateMap<AccountUpdateDTO, Account>();
            CreateMap<AccountDTO, Account>().ReverseMap();


            CreateMap<AccountRoleDTO, AccountRole>().ReverseMap();
            CreateMap<AccountRoleCreateDTO, AccountRole>();
            CreateMap<AccountRoleUpdateDTO, AccountRole>();

            CreateMap<CourseDTO, Course>()
                .ForMember(dest => dest.CourseAccessStatus, opt => opt.MapFrom(src => 
                    !string.IsNullOrEmpty(src.CourseAccessStatus) && Enum.IsDefined(typeof(CourseAccessStatus), src.CourseAccessStatus) ? 
                    (CourseAccessStatus)Enum.Parse(typeof(CourseAccessStatus), src.CourseAccessStatus, true) : CourseAccessStatus.Draft))
                .ReverseMap()
                .ForMember(dest => dest.CourseAccessStatus, opt => opt.MapFrom(src => src.CourseAccessStatus.ToString()));
            CreateMap<CourseCreateDTO, Course>()
                .ForMember(dest => dest.CourseAccessStatus, opt => opt.MapFrom(src => 
                    !string.IsNullOrEmpty(src.CourseAccessStatus) && Enum.IsDefined(typeof(CourseAccessStatus), src.CourseAccessStatus) ? 
                    (CourseAccessStatus)Enum.Parse(typeof(CourseAccessStatus), src.CourseAccessStatus, true) : CourseAccessStatus.Draft));
            CreateMap<CourseUpdateDTO, Course>()
                .ForMember(dest => dest.CourseAccessStatus, opt => opt.MapFrom(src => 
                    !string.IsNullOrEmpty(src.CourseAccessStatus) && Enum.IsDefined(typeof(CourseAccessStatus), src.CourseAccessStatus) ? 
                    (CourseAccessStatus)Enum.Parse(typeof(CourseAccessStatus), src.CourseAccessStatus, true) : CourseAccessStatus.Draft));

            CreateMap<CategoryDTO, Category>().ReverseMap();
            CreateMap<CategoryCreateDTO, Category>();
            CreateMap<CategoryUpdateDTO, Category>();

            CreateMap<LectureDTO, Lecture>().ReverseMap();
            CreateMap<LectureUpdateDTO, Lecture>();
            CreateMap<LectureCreateDTO, Lecture>();

            CreateMap<RoleDTO, Role>().ReverseMap();
            CreateMap<RoleUpdateDTO, Role>();
            CreateMap<RoleCreateDTO, Role>();

            CreateMap<StudentCourseDTO, StudentCourse>().ReverseMap();
            CreateMap<StudentCourseUpdateDTO, StudentCourse>();
            CreateMap<StudentCourseCreateDTO, StudentCourse>();

            CreateMap<StudentProgressDTO, StudentProgress>().ReverseMap();
            CreateMap<StudentProgressUpdateDTO, StudentProgress>()
                .ForMember(dest => dest.LastUpdate, opt => opt.Ignore()); 
            CreateMap<StudentProgressCreateDTO, StudentProgress>()
                .ForMember(dest => dest.LastUpdate, opt => opt.Ignore());

            CreateMap<FacultyDTO, Faculty>().ReverseMap();
            CreateMap<FacultyCreateDTO, Faculty>();
            CreateMap<DepartmentDTO, Department>().ReverseMap();

            CreateMap<DepartmentUpdateDTO, Department>();
            CreateMap<DepartmentCreateDTO, Department>();


        }
    }
}
