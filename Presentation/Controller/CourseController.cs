using Application.Contracts;
using Contracts.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.OpenApi.Validations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly IServiceManager _service;
        
        public CourseController(IServiceManager service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAllCourse()
        {
            var courses = _service.CourseService.GetAllCourse();
            return Ok(courses);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetCourseById([FromRoute(Name = "id")] int id)
        {
            var course = _service.CourseService.GetCourse(id);
            if (course == null)
                return NotFound();
            return Ok(course);
        }

        [HttpGet("by-instructor/{instructorId:int}")]
        public IActionResult GetCoursesByInstructor([FromRoute(Name = "instructorId")] int instructorId)
        {
            var courses = _service.CourseService.GetCoursesByInstructor(instructorId);
            return Ok(courses);
        }

        [HttpGet("with-account")]
        public IActionResult GetCourseWithAccount()
        {
            var courses = _service.CourseService.GetCourseWithAccount();
            return Ok(courses);
        }

        [HttpPost]
        public IActionResult CreateCourse([FromBody] CourseCreateDTO dto)
        {
            var course = _service.CourseService.CreateCourse(dto);
            return CreatedAtAction(nameof(GetCourseById), new { id = course.Id }, course);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateCourse([FromRoute(Name = "id")] int id, [FromBody] CourseUpdateDTO dto)
        {
            var course = _service.CourseService.UpdateCourse(id, dto);
            if (course == null)
                return NotFound();
            return Ok(course);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteCourse([FromRoute(Name = "id")] int id)
        {
            _service.CourseService.DeleteCourse(id);
            return NoContent();
        }
    }
}
