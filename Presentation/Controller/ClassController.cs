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
    public class ClassController : ControllerBase
    {
        private readonly IServiceManager _service;
        
        public ClassController(IServiceManager service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAllClasses()
        {
            var classes = _service.ClassService.GetAllClasses();
            return Ok(classes);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetClassById([FromRoute(Name = "id")] int id)
        {
            var classDto = _service.ClassService.GetClassById(id);
            if (classDto == null)
                return NotFound();
            return Ok(classDto);
        }

        [HttpPost]
        public IActionResult CreateClass([FromBody] ClassCreateDTO dto)
        {
            var classDto = _service.ClassService.CreateClass(dto);
            return CreatedAtAction(nameof(GetClassById), new { id = classDto.Id }, classDto);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateClass([FromRoute(Name = "id")] int id, [FromBody] ClassUpdateDTO dto)
        {
            var classDto = _service.ClassService.UpdateClass(dto, id);
            if (classDto == null)
                return NotFound();
            return Ok(classDto);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteClass([FromRoute(Name = "id")] int id)
        {
            _service.ClassService.DeleteClass(id);
            return NoContent();
        }
    }
}