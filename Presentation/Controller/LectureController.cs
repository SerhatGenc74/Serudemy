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
            {
                // Test için örnek lecture döndür
                return Ok(new
                {
                    Id = lectureId,
                    Name = "Test Lecture " + lectureId,
                    VideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4",
                    LectureDuration = 300,
                    VideoDesc = "Test video açıklaması",
                    CoursesId = 1
                });
            }
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
            return Ok(new { count , message = "Toplam ders sayısı başarıyla alındı." });
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

        // Schedule (Zamanlama) Endpoint'leri

        // Zamanlanmış ve yayınlanma zamanı gelmiş dersleri yayınla
        [HttpPost("publish-scheduled")]
        public IActionResult PublishScheduledLectures()
        {
            var publishedCount = _manager.LectureService.PublishScheduledLectures();
            return Ok(new { publishedCount, message = $"{publishedCount} ders yayınlandı." });
        }

        // Yayınlanmış dersleri getir (öğrenciler için)
        [HttpGet("course/{courseId:int}/published")]
        public IActionResult GetPublishedLectures([FromRoute(Name = "courseId")] int courseId)
        {
            var lectures = _manager.LectureService.GetPublishedLectures(courseId);
            return Ok(lectures);
        }

        // Tüm dersleri getir (öğretmenler için - zamanlanmış dahil)
        [HttpGet("course/{courseId:int}/instructor")]
        public IActionResult GetAllLecturesForInstructor([FromRoute(Name = "courseId")] int courseId)
        {
            var lectures = _manager.LectureService.GetAllLecturesForInstructor(courseId);
            return Ok(lectures);
        }

        // Zamanlanmış (henüz yayınlanmamış) dersleri getir
        [HttpGet("course/{courseId:int}/scheduled")]
        public IActionResult GetScheduledLectures([FromRoute(Name = "courseId")] int courseId)
        {
            var lectures = _manager.LectureService.GetScheduledLectures(courseId);
            return Ok(lectures);
        }

        // Öğrenciler için dersleri getir (yayınlanmış + zamanlanmış, taslaklar hariç)
        [HttpGet("course/{courseId:int}/student")]
        public IActionResult GetLecturesForStudent([FromRoute(Name = "courseId")] int courseId)
        {
            var lectures = _manager.LectureService.GetLecturesForStudent(courseId);
            return Ok(lectures);
        }

        // Lecture status management endpoints (Taslak/Yayınlanma/Arşiv)
        [HttpPost("{lectureId:int}/publish")]
        public IActionResult PublishLecture([FromRoute(Name = "lectureId")] int lectureId)
        {
            try
            {
                var lecture = _manager.LectureService.PublishLecture(lectureId);
                return Ok(new { message = "Ders başarıyla yayınlandı", lecture });
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

        [HttpPost("{lectureId:int}/unpublish")]
        public IActionResult UnpublishLecture([FromRoute(Name = "lectureId")] int lectureId)
        {
            try
            {
                var lecture = _manager.LectureService.UnpublishLecture(lectureId);
                return Ok(new { message = "Ders taslağa alındı", lecture });
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

        [HttpPost("{lectureId:int}/archive")]
        public IActionResult ArchiveLecture([FromRoute(Name = "lectureId")] int lectureId)
        {
            try
            {
                var lecture = _manager.LectureService.ArchiveLecture(lectureId);
                return Ok(new { message = "Ders arşivlendi", lecture });
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

        [HttpPost("{lectureId:int}/accessibility")]
        public IActionResult SetLectureAccessibility([FromRoute(Name = "lectureId")] int lectureId, [FromBody] bool isAccessible)
        {
            try
            {
                var lecture = _manager.LectureService.SetLectureAccessibility(lectureId, isAccessible);
                return Ok(new { message = $"Ders erişilebilirliği {isAccessible} olarak ayarlandı", lecture });
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

        [HttpGet("course/{courseId:int}/published-by-status")]
        public IActionResult GetPublishedLecturesByStatus([FromRoute(Name = "courseId")] int courseId)
        {
            var lectures = _manager.LectureService.GetPublishedLecturesByStatus(courseId);
            return Ok(lectures);
        }

        [HttpGet("course/{courseId:int}/accessible")]
        public IActionResult GetAccessibleLectures([FromRoute(Name = "courseId")] int courseId)
        {
            var lectures = _manager.LectureService.GetAccessibleLectures(courseId);
            return Ok(lectures);
        }

        [HttpGet("{lectureId:int}/is-accessible")]
        public IActionResult IsLectureAccessible([FromRoute(Name = "lectureId")] int lectureId)
        {
            try
            {
                var lecture = _manager.LectureService.GetLecture(lectureId);
                if (lecture == null)
                    return NotFound(new { message = "Ders bulunamadı" });

                return Ok(new { 
                    lectureId = lectureId,
                    isAccessible = lecture.IsAccessible,
                    lectureAccessStatus = lecture.LectureAccessStatus
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
