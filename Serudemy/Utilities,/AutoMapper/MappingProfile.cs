using AutoMapper;
using Contracts.DTOs;
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

            CreateMap<StudentClassDTO,StudentClass>().ReverseMap();
            CreateMap<StudentClassCreateDTO, StudentClass>();
            CreateMap<StudentClassUpdateDTO, StudentClass>();

            CreateMap<FacultyDTO, Faculty>().ReverseMap();
            CreateMap<FacultyCreateDTO, Faculty>();
            CreateMap<DepartmentDTO, Department>().ReverseMap();

            CreateMap<DepartmentUpdateDTO, Department>();
            CreateMap<DepartmentCreateDTO, Department>();
            CreateMap<ClassDTO, Class>().ReverseMap();

            CreateMap<ClassCreateDTO, Class>();
            CreateMap<ClassUpdateDTO, Class>();
            CreateMap<ClassDTO, Class>().ReverseMap();

            CreateMap<ClassDepartmentDTO, ClassDepartment>().ReverseMap();
            CreateMap<ClassDepartmentCreateDTO, ClassDepartment>();
            CreateMap<ClassDepartmentUpdateDTO, ClassDepartment>();


        }
    }
}
