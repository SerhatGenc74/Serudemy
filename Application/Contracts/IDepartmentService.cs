using Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface IDepartmentService
    {
        public IQueryable<DepartmentDTO> GetAllDepartments();
        public IQueryable<DepartmentDTO> GetDepartmentsByFaculty(int facultyId);
        public DepartmentDTO GetDepartmentById(int id);
        public DepartmentDTO CreateDepartment(DepartmentCreateDTO dto);
        public DepartmentDTO UpdateDepartment(DepartmentUpdateDTO dto, int id);
        public void DeleteDepartment(int id);
    }
}