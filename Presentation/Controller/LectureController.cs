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
    public class LectureController : ControllerBase
    {
        IServiceManager _manager;
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
        [HttpGet("{courseId:int}")]
        public IActionResult GetAllLecures([FromRoute(Name ="courseId")]int courseId)
        {
            var lectures = _manager.LectureService.GetAllLectures(courseId);
            return Ok(lectures);
        }
        [HttpGet("{lectureId:int}")]
        public IActionResult GetLecture([FromRoute(Name = "lectureId")]int lectureId)
        {
            var lecture = _manager.LectureService.GetLecture(lectureId);
            return Ok(lecture);
        }
        [HttpPost]
        public IActionResult CreateLecture([FromBody] LectureCreateDTO dto)
        {
            var lecture = _manager.LectureService.CreateLecture(dto);
            return Ok(lecture);
        }
        [HttpPut]
        public IActionResult UpdateLecture([FromBody] LectureUpdateDTO dto,int lectureId)
        {
            var lecture = _manager.LectureService.UpdateLecture(dto,lectureId);
            return Ok(lecture);
        }


    }
}
