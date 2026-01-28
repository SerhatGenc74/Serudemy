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
    public class StudentCourseController : ControllerBase
    {
        private readonly IServiceManager _service;
        
        public StudentCourseController(IServiceManager service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAllStudentCourses()
        {
            var studentCourses = _service.StudentCourse.GetAllStudentCourses();
            return Ok(studentCourses);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetStudentCourseById([FromRoute(Name = "id")] int id)
        {
            var studentCourse = _service.StudentCourse.GetStudentCourseById(id);
            if (studentCourse == null)
                return NotFound();
            return Ok(studentCourse);
        }

        [HttpGet("courses/student/{studentId:int}")]
        public IActionResult GetCoursesByStudent([FromRoute(Name = "studentId")] int studentId)
        {
            var courses = _service.StudentCourse.GetCoursesByStudent(studentId);
            return Ok(courses);
        }
        

        [HttpGet("course/{courseId:int}/students")]
        public IActionResult GetStudentsByCourse([FromRoute(Name = "courseId")] int courseId)
        {
            var students = _service.StudentCourse.GetStudentsByCourse(courseId);
            return Ok(students);
        }

        [HttpGet("course/{courseId:int}")]
        public IActionResult GetStudentCoursesByCourse([FromRoute(Name = "courseId")] int courseId)
        {
            var studentCourses = _service.StudentCourse.GetStudentCoursesByCourse(courseId);
            return Ok(studentCourses);
        }

        [HttpGet("eligible-students")]
        public IActionResult GetEligibleStudentsForCourse([FromQuery] int courseId)
        {
            try
            {
                var eligibleStudents = _service.StudentCourse.GetEligibleStudentsForCourse(courseId);
                return Ok(eligibleStudents);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error getting eligible students: {ex.Message}");
            }
        }

        [HttpGet("is-enrolled/{studentId:int}/{courseId:int}")]
        public IActionResult IsStudentEnrolledInCourse([FromRoute] int studentId, [FromRoute] int courseId)
        {
            try
            {
                var isEnrolled = _service.StudentCourse.IsStudentEnrolledInCourse(studentId, courseId);
                return Ok(new { isEnrolled = isEnrolled });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error checking enrollment: {ex.Message}");
            }
        }

        [HttpPost("enroll/{courseId:int}/{studentId:int}")]
        public IActionResult EnrollStudentInCourse(
            [FromRoute] int courseId, 
            [FromRoute] int studentId, 
            [FromBody] StudentCourseCreateDTO dto)
        {
            try
            {
                var result = _service.StudentCourse.EnrollStudentInCourse(studentId, courseId, dto);
                if (result == null)
                    return BadRequest("Enrollment failed.");

                return CreatedAtAction(nameof(GetStudentCourseById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Enrollment error: {ex.Message}");
            }
        }

        [HttpPost]
        public IActionResult CreateStudentCourse([FromBody] StudentCourseCreateDTO dto)
        {
            var studentCourse = _service.StudentCourse.CreateStudentCourse(dto);
            return CreatedAtAction(nameof(GetStudentCourseById), new { id = studentCourse.Id }, studentCourse);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateStudentCourse([FromRoute(Name = "id")] int id, [FromBody] StudentCourseUpdateDTO dto)
        {
            var studentCourse = _service.StudentCourse.UpdateStudentCourse(dto, id);
            if (studentCourse == null)
                return NotFound();
            return Ok(studentCourse);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteStudentCourse([FromRoute(Name = "id")] int id)
        {
            _service.StudentCourse.DeleteStudentCourse(id);
            return NoContent();
        }

        [HttpDelete("unenroll/{courseId:int}/{studentId:int}")]
        public IActionResult UnenrollStudentFromCourse(
            [FromRoute] int courseId, 
            [FromRoute] int studentId)
        {
            try
            {
                var result = _service.StudentCourse.UnenrollStudentFromCourse(studentId, courseId);
                if (!result)
                    return NotFound("Student enrollment not found.");
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Unenrollment error: {ex.Message}");
            }
        }
    }
}
