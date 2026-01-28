using Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface ICategoryService
    {
        public IQueryable<CategoryDTO> GetAllCategories();
        public CategoryDTO GetCategoryById(int id);
        public CategoryDTO CreateCategory(CategoryCreateDTO dto);
        public CategoryDTO UpdateCategory(CategoryUpdateDTO dto, int id);
        public void DeleteCategory(int id);
    }
}