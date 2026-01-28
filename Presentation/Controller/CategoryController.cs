using Application.Contracts;
using Contracts.DTOs;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly IServiceManager _service;
        
        public CategoryController(IServiceManager service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAllCategories()
        {
            var categories = _service.CategoryService.GetAllCategories();
            return Ok(categories);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetCategoryById([FromRoute(Name = "id")] int id)
        {
            var category = _service.CategoryService.GetCategoryById(id);
            if (category == null)
                return NotFound();
            return Ok(category);
        }

        [HttpPost]
        public IActionResult CreateCategory([FromBody] CategoryCreateDTO dto)
        {
            var category = _service.CategoryService.CreateCategory(dto);
            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateCategory([FromRoute(Name = "id")] int id, [FromBody] CategoryUpdateDTO dto)
        {
            var category = _service.CategoryService.UpdateCategory(dto, id);
            if (category == null)
                return NotFound();
            return Ok(category);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteCategory([FromRoute(Name = "id")] int id)
        {
            _service.CategoryService.DeleteCategory(id);
            return NoContent();
        }
    }
}