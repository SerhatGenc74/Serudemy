using AutoMapper;
using Contracts.DTO;
using Domain.Entities;

namespace Serudemy.Utilities_.AutoMapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AccountCreateDTO, Account>();
            CreateMap<AccountUpdateDTO, Account>();
            CreateMap<AccountDTO, Account>().ReverseMap();

            CreateMap<AccountRoleCreateDTO, AccountRole>();

            CreateMap<CourseDTO, Course>().ReverseMap();
            CreateMap<CourseCreateDTO, Course>();
            CreateMap<CourseUpdateDTO, Course>();

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
            CreateMap<StudentProgressUpdateDTO, StudentProgress>();
            CreateMap<StudentProgressCreateDTO, StudentProgress>();
        }
    }
}
