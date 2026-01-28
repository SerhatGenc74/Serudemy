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

        [HttpGet("admin")]
        public IActionResult GetAllCourseForAdmin()
        {
            var courses = _service.CourseService.GetAllCourseForAdmin();
            return Ok(courses);
        }
        [HttpGet("random")]
        public async Task<IActionResult> GetRandomNumber()
        {
            var number = await _service.CourseService.GenerateUniqueCourseIdAsync();
            return Ok(number);
        }

        [HttpGet("{courseId:int}")]
        public IActionResult GetCourseById([FromRoute(Name = "courseId")] int courseId)
        {
            var course = _service.CourseService.GetCourse(courseId);
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

        [HttpPost("create")]
        public IActionResult CreateCourse([FromBody] CourseCreateDTO dto)
        {
            var course = _service.CourseService.CreateCourse(dto);
            return Ok(course);
        }

        [HttpPut("{courseId:int}")]
        public IActionResult UpdateCourse([FromRoute(Name = "courseId")] int courseId, [FromBody] CourseUpdateDTO dto)
        {
            try
            {
                var course = _service.CourseService.UpdateCourse(courseId, dto);
                return Ok(course);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteCourse([FromRoute(Name = "id")] int id)
        {
            _service.CourseService.DeleteCourse(id);
            return NoContent();
        }

        // Course access control endpoints
        [HttpPost("{courseId:int}/publish")]
        public IActionResult PublishCourse([FromRoute(Name = "courseId")] int courseId)
        {
            try
            {
                var course = _service.CourseService.PublishCourse(courseId);
                return Ok(new { message = "Course published successfully", course });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{courseId:int}/unpublish")]
        public IActionResult UnpublishCourse([FromRoute(Name = "courseId")] int courseId)
        {
            try
            {
                var course = _service.CourseService.UnpublishCourse(courseId);
                return Ok(new { message = "Course unpublished successfully", course });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{courseId:int}/archive")]
        public IActionResult ArchiveCourse([FromRoute(Name = "courseId")] int courseId)
        {
            try
            {
                var course = _service.CourseService.ArchiveCourse(courseId);
                return Ok(new { message = "Course archived successfully", course });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{courseId:int}/accessibility")]
        public IActionResult SetCourseAccessibility([FromRoute(Name = "courseId")] int courseId, [FromBody] bool isAccessible)
        {
            try
            {
                var course = _service.CourseService.SetCourseAccessibility(courseId, isAccessible);
                return Ok(new { message = $"Course accessibility set to {isAccessible}", course });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("published")]
        public IActionResult GetPublishedCourses()
        {
            var courses = _service.CourseService.GetPublishedCourses();
            return Ok(courses);
        }

        [HttpGet("accessible")]
        public IActionResult GetAccessibleCourses()
        {
            var courses = _service.CourseService.GetAccessibleCourses();
            return Ok(courses);
        }

        [HttpGet("{courseId:int}/is-accessible")]
        public IActionResult IsCourseAccessible([FromRoute(Name = "courseId")] int courseId)
        {
            try
            {
                var course = _service.CourseService.GetCourse(courseId);
                if (course == null)
                    return NotFound(new { message = "Course not found" });

                return Ok(new { 
                    courseId = courseId,
                    isAccessible = course.IsAccessible,
                    courseAccessStatus = course.CourseAccessStatus
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
