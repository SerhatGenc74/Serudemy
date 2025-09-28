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
    public class StudentProgressController : ControllerBase
    {
        IServiceManager _service;
        public StudentProgressController(IServiceManager manager)
        {
            _service = manager;
        }
        [HttpGet]
        public IActionResult GetAllStudentProgress()
        {
            var result = _service.StudentProgress.GetAllStudentProgress();
            return Ok(result);
        }
        [HttpGet("withlecture")]
        public IActionResult GetAllStudentProgressWithLecture()
        {
            var result = _service.StudentProgress.GetAllStudentProgressWithLecture();
            return Ok(result);
        }
        [HttpGet("completedlessons/{studentId:int}/{courseId:int}")]
        public IActionResult GetCompletedLessons([FromRoute(Name = "studentId")] int studentId, [FromRoute(Name = "courseId")] int courseId)
        {
            var result = _service.StudentProgress.GetCompletedLessons(studentId, courseId);
            return Ok(result);
        }
        [HttpGet("completedlessons/count/{studentId:int}/{courseId:int}")]
        public IActionResult GetCompletedLessonCount([FromRoute(Name = "studentId")] int studentId, [FromRoute(Name = "courseId")] int courseId)
        {
            var result = _service.StudentProgress.GetCompletedLessonCount(studentId, courseId);
            return Ok(result);
        }
        [HttpGet("lastprogress/{accountId:int}/{courseId:int}")]
        public IActionResult GetLastProgressWithLecture([FromRoute(Name = "accountId")] int accountId, [FromRoute(Name = "courseId")] int courseId)
        {
            var result = _service.StudentProgress.GetLastProgressWithLecture(accountId, courseId);
            return Ok(result);
        }
        [HttpPost]
        public IActionResult CreateStudentProgress([FromBody] StudentProgressCreateDTO dto)
        {
            var result = _service.StudentProgress.CreateStudentProgress(dto);
            return Ok(result);
        }
        [HttpPut("{id:int}")]
        public IActionResult UpdateStudentProgress([FromBody] StudentProgressUpdateDTO dto, [FromRoute(Name = "id")] int id)
        {
            var result = _service.StudentProgress.UpdateStudentProgress(dto, id);
            return Ok(result);
        }


    }
}
