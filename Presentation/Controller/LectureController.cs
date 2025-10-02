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
    public class LectureController : ControllerBase
    {
        private readonly IServiceManager _manager;
        
        public LectureController(IServiceManager manager)
        {
            _manager = manager;
        }

        [HttpGet]
        public IActionResult GetAllLectures()
        {
            var lectures = _manager.LectureService.GetAllLectures();
            return Ok(lectures);
        }

        [HttpGet("{lectureId:int}")]
        public IActionResult GetLecture([FromRoute(Name = "lectureId")] int lectureId)
        {
            var lecture = _manager.LectureService.GetLecture(lectureId);
            if (lecture == null)
                return NotFound();
            return Ok(lecture);
        }

        [HttpGet("course/{courseId:int}")]
        public IActionResult GetLecturesByCourse([FromRoute(Name = "courseId")] int courseId)
        {
            var lectures = _manager.LectureService.GetAllLectures(courseId);
            return Ok(lectures);
        }

        [HttpGet("course/{courseId:int}/with-course")]
        public IActionResult GetLecturesWithCourse([FromRoute(Name = "courseId")] int courseId)
        {
            var lectures = _manager.LectureService.GetAllLecturesWithCourse(courseId);
            return Ok(lectures);
        }

        [HttpGet("course/{courseId:int}/first")]
        public IActionResult GetFirstLecture([FromRoute(Name = "courseId")] int courseId)
        {
            var lecture = _manager.LectureService.GetFirstLecture(courseId);
            if (lecture == null)
                return NotFound();
            return Ok(lecture);
        }

        [HttpGet("course/{courseId:int}/count")]
        public IActionResult GetTotalLessonCount([FromRoute(Name = "courseId")] int courseId)
        {
            var count = _manager.LectureService.GetTotalLessonCount(courseId);
            return Ok(new { count });
        }

        [HttpPost]
        public IActionResult CreateLecture([FromBody] LectureCreateDTO dto)
        {
            var lecture = _manager.LectureService.CreateLecture(dto);
            return CreatedAtAction(nameof(GetLecture), new { lectureId = lecture.Id }, lecture);
        }

        [HttpPut("{lectureId:int}")]
        public IActionResult UpdateLecture([FromRoute(Name = "lectureId")] int lectureId, [FromBody] LectureUpdateDTO dto)
        {
            var lecture = _manager.LectureService.UpdateLecture(dto, lectureId);
            if (lecture == null)
                return NotFound();
            return Ok(lecture);
        }

        [HttpDelete("{lectureId:int}")]
        public IActionResult DeleteLecture([FromRoute(Name = "lectureId")] int lectureId)
        {
            var result = _manager.LectureService.DeleteLecture(lectureId);
            if (!result)
                return NotFound();
            return NoContent();
        }

        [HttpPut("{lectureId:int}/reorder")]
        public IActionResult ReorderLecture([FromRoute(Name = "lectureId")] int lectureId, [FromBody] int newOrder)
        {
            var result = _manager.LectureService.ReorderLecture(lectureId, newOrder);
            if (!result)
                return NotFound();
            return Ok();
        }
    }
}
