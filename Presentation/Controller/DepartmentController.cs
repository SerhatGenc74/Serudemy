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
    public class DepartmentController : ControllerBase
    {
        private readonly IServiceManager _service;
        
        public DepartmentController(IServiceManager service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAllDepartments()
        {
            var departments = _service.DepartmentService.GetAllDepartments();
            return Ok(departments);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetDepartmentById([FromRoute(Name = "id")] int id)
        {
            var department = _service.DepartmentService.GetDepartmentById(id);
            if (department == null)
                return NotFound();
            return Ok(department);
        }

        [HttpGet("faculty/{facultyId:int}")]
        public IActionResult GetDepartmentsByFaculty([FromRoute(Name = "facultyId")] int facultyId)
        {
            var departments = _service.DepartmentService.GetDepartmentsByFaculty(facultyId);
            return Ok(departments);
        }

        [HttpPost]
        public IActionResult CreateDepartment([FromBody] DepartmentCreateDTO dto)
        {
            var department = _service.DepartmentService.CreateDepartment(dto);
            return CreatedAtAction(nameof(GetDepartmentById), new { id = department.Id }, department);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateDepartment([FromRoute(Name = "id")] int id, [FromBody] DepartmentUpdateDTO dto)
        {
            var department = _service.DepartmentService.UpdateDepartment(dto, id);
            if (department == null)
                return NotFound();
            return Ok(department);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteDepartment([FromRoute(Name = "id")] int id)
        {
            _service.DepartmentService.DeleteDepartment(id);
            return NoContent();
        }
    }
}