using Contracts.DTO;
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
        IServiceManager _service;
        public CourseController(IServiceManager service)
        {
            _service = service;
        }
        [HttpGet]
        public IActionResult GetAllCourse()
        {
            var course = _service.CourseService.GetAllCourse();
            return Ok(course);
        }
        [HttpGet("{id:int}")]
        public IActionResult GetById([FromRoute(Name = "id")] int id)
        {
            var course = _service.CourseService.GetCourse(id);
            return Ok(course);
        }
        [HttpPost]
        public IActionResult CreateCourse([FromBody]CourseCreateDTO dto)
        {
            _service.CourseService.CreateCourse(dto);
            return Ok();
        }
        [HttpPut("{id:int}")]
        public IActionResult UpdateCourse([FromRoute(Name ="id")]int id, [FromBody]CourseUpdateDTO dto)
        {
            _service.CourseService.UpdateCourse(id,dto);
            return Ok();
        }

    }
}
