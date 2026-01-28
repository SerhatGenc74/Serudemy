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
    public class StudentProgressController : ControllerBase
    {
        private readonly IServiceManager _service;
        
        public StudentProgressController(IServiceManager service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAllStudentProgress()
        {
            var result = _service.StudentProgress.GetAllStudentProgress();
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetStudentProgressById([FromRoute(Name = "id")] int id)
        {
            var progress = _service.StudentProgress.GetStudentProgressById(id);
            if (progress == null)
                return NotFound();
            return Ok(progress);
        }

        [HttpGet("with-lecture")]
        public IActionResult GetAllStudentProgressWithLecture()
        {
            var result = _service.StudentProgress.GetAllStudentProgressWithLecture();
            return Ok(result);
        }

        [HttpGet("student/{studentId:int}/course/{courseId:int}/completed")]
        public IActionResult GetCompletedLessons([FromRoute(Name = "studentId")] int studentId, [FromRoute(Name = "courseId")] int courseId)
        {
            var result = _service.StudentProgress.GetCompletedLessons(studentId, courseId);
            return Ok(result);
        }
        [HttpGet("course/{courseId:int}/student/{studentId:int}/progress")]
        public IActionResult GetStudentProgressInCourse([FromRoute(Name = "studentId")] int studentId, [FromRoute(Name = "courseId")] int courseId)
        {
            var progress = _service.StudentProgress.GetStudentProgressInCourse(studentId, courseId);
            return Ok(progress);
        }


        [HttpGet("student/{studentId:int}/course/{courseId:int}/completed/count")]
        public IActionResult GetCompletedLessonCount([FromRoute(Name = "studentId")] int studentId, [FromRoute(Name = "courseId")] int courseId)
        {
            var completedCount = _service.StudentProgress.GetCompletedLessonCount(studentId, courseId);
            var totalCount = _service.LectureService.GetTotalLessonCount(courseId);
            return Ok(new { completedCount = completedCount, totalCount = (int)totalCount });
        }

        [HttpGet("student/{accountId:int}/course/{courseId:int}/last")]
        public IActionResult GetLastProgressWithLecture([FromRoute(Name = "accountId")] int accountId, [FromRoute(Name = "courseId")] int courseId)
        {
            try
            {
                var result = _service.StudentProgress.GetLastProgressWithLecture(accountId, courseId);
                if (result == null)
                    return Ok(null); // Return null instead of 404 for better frontend handling
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error getting last progress: {ex.Message}");
            }
        }

        [HttpGet("student/{studentId:int}")]
        public IActionResult GetStudentProgressByStudentId([FromRoute(Name = "studentId")] int studentId)
        {
            var progresses = _service.StudentProgress.GetStudentProgressByStudentId(studentId);
            return Ok(progresses);
        }
        
        [HttpGet("lecture/{lectureId:int}")]
        public IActionResult GetStudentProgressByLectureId([FromRoute(Name = "lectureId")] int lectureId)
        {
            var progresses = _service.StudentProgress.GetStudentProgressByLectureId(lectureId);
            return Ok(progresses);
        }

        [HttpPost]
        public IActionResult CreateStudentProgress([FromBody] StudentProgressCreateDTO dto)
        {
            var result = _service.StudentProgress.CreateStudentProgress(dto);
            return CreatedAtAction(nameof(GetStudentProgressById), new { id = result.Id }, result);
        }

        [HttpGet("progress/{studentId:int}/{lectureId:int}")]
        public IActionResult IsAlreadyHaveProgress([FromRoute] int studentId, [FromRoute] int lectureId)
        {
            var result = _service.StudentProgress.IsAlreadyHaveProgress(studentId, lectureId);
            
            // Frontend expects result and progressId properties
            if (result != null)
            {
                return Ok(new { result = true, progressId = result.Id, progress = result });
            }
            
            return Ok(new { result = false, progressId = (int?)null, progress = (StudentProgressDTO?)null });
        }

        [HttpGet("course/{courseId:int}/overview")]
        public IActionResult GetCourseProgressOverview([FromRoute(Name = "courseId")] int courseId)
        {
            try
            {
                var result = _service.StudentProgress.GetCourseProgressOverview(courseId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error getting course progress: {ex.Message}");
            }
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateStudentProgress([FromRoute(Name = "id")] int id, [FromBody] StudentProgressUpdateDTO dto)
        {
            var result = _service.StudentProgress.UpdateStudentProgress(dto, id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteStudentProgress([FromRoute(Name = "id")] int id)
        {
            _service.StudentProgress.DeleteStudentProgress(id);
            return NoContent();
        }
    }
}
