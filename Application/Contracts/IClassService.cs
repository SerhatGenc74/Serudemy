using Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface IClassService
    {
        public IQueryable<ClassDTO> GetAllClasses();
        public ClassDTO GetClassById(int id);
        public ClassDTO CreateClass(ClassCreateDTO dto);
        public ClassDTO UpdateClass(ClassUpdateDTO dto, int id);
        public void DeleteClass(int id);
    }
}