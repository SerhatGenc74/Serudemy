using Entities.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.OpenApi.Validations;
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
    public class CourseController : ControllerBase
    {
        ICourseService _service;
        public CourseController(ICourseService service)
        {
            _service = service;
        }
        [HttpGet]
        public IActionResult GetAllCourse()
        {
            var course = _service.GetAllCourse();
            return Ok(course);
        }
        [HttpGet("{id:int}")]
        public IActionResult GetById([FromRoute(Name = "id")] int id)
        {
            var course = _service.GetCourse(id);
            return Ok(course);
        }
        [HttpPost]
        public IActionResult CreateCourse([FromBody]CourseCreateDTO dto)
        {
            _service.CreateCourse(dto);
            return Ok();
        }
        [HttpPut("{id:int}")]
        public IActionResult UpdateCourse([FromRoute(Name ="id")]int id, [FromBody]CourseUpdateDTO dto)
        {
            _service.UpdateCourse(id,dto);
            return Ok();
        }

    }
}
