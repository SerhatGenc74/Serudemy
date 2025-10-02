using Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface IClassDepartmentService
    {
        public IQueryable<ClassDepartmentDTO> GetAllClassDepartments();
        public ClassDepartmentDTO GetClassDepartmentById(int id);
        public IQueryable<ClassDepartmentDTO> GetClassDepartmentsByDepartmentId(int departmentId);
        public IQueryable<ClassDepartmentDTO> GetClassDepartmentsByClassId(int classId);
        public ClassDepartmentDTO CreateClassDepartment(ClassDepartmentCreateDTO dto);
        public ClassDepartmentDTO UpdateClassDepartment(ClassDepartmentUpdateDTO dto, int id);
        public void DeleteClassDepartment(int id);
    }
}