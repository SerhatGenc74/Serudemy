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
    public class FacultyController : ControllerBase
    {
        private readonly IServiceManager _service;
        
        public FacultyController(IServiceManager service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAllFaculties()
        {
            var faculties = _service.FacultyService.GetAllFaculties();
            return Ok(faculties);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetFacultyById([FromRoute(Name = "id")] int id)
        {
            var faculty = _service.FacultyService.GetFacultyById(id);
            if (faculty == null)
                return NotFound();
            return Ok(faculty);
        }

        [HttpPost]
        public IActionResult CreateFaculty([FromBody] FacultyCreateDTO dto)
        {
            var faculty = _service.FacultyService.CreateFaculty(dto);
            return CreatedAtAction(nameof(GetFacultyById), new { id = faculty.Id }, faculty);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateFaculty([FromRoute(Name = "id")] int id, [FromBody] FacultyUpdateDTO dto)
        {
            var faculty = _service.FacultyService.UpdateFaculty(dto, id);
            if (faculty == null)
                return NotFound();
            return Ok(faculty);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteFaculty([FromRoute(Name = "id")] int id)
        {
            _service.FacultyService.DeleteFaculty(id);
            return NoContent();
        }
    }
}