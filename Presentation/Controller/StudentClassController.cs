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
    public class StudentClassController : ControllerBase
    {
        private readonly IServiceManager _service;
        
        public StudentClassController(IServiceManager service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAllStudentClasses()
        {
            var studentClasses = _service.StudentClassService.GetAllStudentClasses();
            return Ok(studentClasses);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetStudentClassById([FromRoute(Name = "id")] int id)
        {
            var studentClass = _service.StudentClassService.GetStudentClassById(id);
            if (studentClass == null)
                return NotFound();
            return Ok(studentClass);
        }

        [HttpGet("student/{studentId:int}")]
        public IActionResult GetStudentClassesByStudent([FromRoute(Name = "studentId")] int studentId)
        {
            var studentClasses = _service.StudentClassService.GetStudentClassesByStudentId(studentId);
            return Ok(studentClasses);
        }

        [HttpGet("class/{classId:int}")]
        public IActionResult GetStudentClassesByClass([FromRoute(Name = "classId")] int classId)
        {
            var studentClasses = _service.StudentClassService.GetStudentClassesByClassId(classId);
            return Ok(studentClasses);
        }

        [HttpPost]
        public IActionResult CreateStudentClass([FromBody] StudentClassCreateDTO dto)
        {
            var studentClass = _service.StudentClassService.CreateStudentClass(dto);
            return CreatedAtAction(nameof(GetStudentClassById), new { id = studentClass.Id }, studentClass);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateStudentClass([FromRoute(Name = "id")] int id, [FromBody] StudentClassUpdateDTO dto)
        {
            var studentClass = _service.StudentClassService.UpdateStudentClass(dto, id);
            if (studentClass == null)
                return NotFound();
            return Ok(studentClass);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteStudentClass([FromRoute(Name = "id")] int id)
        {
            _service.StudentClassService.DeleteStudentClass(id);
            return NoContent();
        }
    }
}