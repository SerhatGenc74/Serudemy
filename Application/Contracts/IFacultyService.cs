using Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface IFacultyService
    {
        public IQueryable<FacultyDTO> GetAllFaculties();
        public FacultyDTO GetFacultyById(int id);
        public FacultyDTO CreateFaculty(FacultyCreateDTO dto);
        public FacultyDTO UpdateFaculty(FacultyUpdateDTO dto, int id);
        public void DeleteFaculty(int id);
    }
}