using Contracts.DTO;
using Microsoft.AspNetCore.Mvc;
using Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentCourseController : ControllerBase
    {
        IServiceManager _service;
        public StudentCourseController(IServiceManager service)
        {
            this._service = service;
        }
        [HttpPost]
        public IActionResult EnrollStudentInCourse([FromRoute(Name = "studentId")] int studentId, [FromRoute(Name = "courseId")] int courseId, [FromBody] StudentCourseCreateDTO dto)
        {
            var result = _service.StudentCourse.EnrollStudentInCourse(studentId, courseId, dto);
            if (result == null)
                return BadRequest("Enrollment failed.");

            return Ok(result);
        }
        [HttpGet("{studentId:int}")]
        public IActionResult GetCoursesByStudent([FromRoute(Name = "studentId")] int studentId)
        {
            var result = _service.StudentCourse.GetCoursesByStudent(studentId);
            return Ok(result);
        }
    }
}
