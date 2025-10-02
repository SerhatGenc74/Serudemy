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
    public class ClassDepartmentController : ControllerBase
    {
        private readonly IServiceManager _service;
        
        public ClassDepartmentController(IServiceManager service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAllClassDepartments()
        {
            var classDepartments = _service.ClassDepartmentService.GetAllClassDepartments();
            return Ok(classDepartments);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetClassDepartmentById([FromRoute(Name = "id")] int id)
        {
            var classDepartment = _service.ClassDepartmentService.GetClassDepartmentById(id);
            if (classDepartment == null)
                return NotFound();
            return Ok(classDepartment);
        }

        [HttpGet("department/{departmentId:int}")]
        public IActionResult GetClassDepartmentsByDepartment([FromRoute(Name = "departmentId")] int departmentId)
        {
            var classDepartments = _service.ClassDepartmentService.GetClassDepartmentsByDepartmentId(departmentId);
            return Ok(classDepartments);
        }

        [HttpGet("class/{classId:int}")]
        public IActionResult GetClassDepartmentsByClass([FromRoute(Name = "classId")] int classId)
        {
            var classDepartments = _service.ClassDepartmentService.GetClassDepartmentsByClassId(classId);
            return Ok(classDepartments);
        }

        [HttpPost]
        public IActionResult CreateClassDepartment([FromBody] ClassDepartmentCreateDTO dto)
        {
            var classDepartment = _service.ClassDepartmentService.CreateClassDepartment(dto);
            return CreatedAtAction(nameof(GetClassDepartmentById), new { id = classDepartment.Id }, classDepartment);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateClassDepartment([FromRoute(Name = "id")] int id, [FromBody] ClassDepartmentUpdateDTO dto)
        {
            var classDepartment = _service.ClassDepartmentService.UpdateClassDepartment(dto, id);
            if (classDepartment == null)
                return NotFound();
            return Ok(classDepartment);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteClassDepartment([FromRoute(Name = "id")] int id)
        {
            _service.ClassDepartmentService.DeleteClassDepartment(id);
            return NoContent();
        }
    }
}