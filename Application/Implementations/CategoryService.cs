using Application.Contracts;
using AutoMapper;
using Contracts.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly IRepositoryManager _manager;
        private readonly IMapper _mapper;

        public CategoryService(IRepositoryManager manager, IMapper mapper)
        {
            _manager = manager;
            _mapper = mapper;
        }

        public IQueryable<CategoryDTO> GetAllCategories()
        {
            var entities = _manager.Category.FindAll(false);
            return _mapper.ProjectTo<CategoryDTO>(entities);
        }

        public CategoryDTO GetCategoryById(int id)
        {
            var entity = _manager.Category.FindByCondition(c => c.Id == id, false);
            return _mapper.Map<CategoryDTO>(entity);
        }

        public CategoryDTO CreateCategory(CategoryCreateDTO dto)
        {
            var entity = _mapper.Map<Category>(dto);
            
            _manager.Category.Create(entity);
            _manager.Save();

            return _mapper.Map<CategoryDTO>(entity);
        }

        public CategoryDTO UpdateCategory(CategoryUpdateDTO dto, int id)
        {
            var entity = _manager.Category.FindByCondition(c => c.Id == id, false);
            if (entity == null)
                return null;

            _mapper.Map(dto, entity);
            _manager.Category.Update(entity);
            _manager.Save();

            return _mapper.Map<CategoryDTO>(entity);
        }

        public void DeleteCategory(int id)
        {
            var entity = _manager.Category.FindByCondition(c => c.Id == id, false);
            if (entity != null)
            {
                _manager.Category.Delete(entity);
                _manager.Save();
            }
        }
    }
}