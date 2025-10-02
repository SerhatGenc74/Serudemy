using Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface IStudentClassService
    {
        public IQueryable<StudentClassDTO> GetAllStudentClasses();
        public StudentClassDTO GetStudentClassById(int id);
        public IQueryable<StudentClassDTO> GetStudentClassesByStudentId(int studentId);
        public IQueryable<StudentClassDTO> GetStudentClassesByClassId(int classId);
        public StudentClassDTO CreateStudentClass(StudentClassCreateDTO dto);
        public StudentClassDTO UpdateStudentClass(StudentClassUpdateDTO dto, int id);
        public void DeleteStudentClass(int id);
    }
}