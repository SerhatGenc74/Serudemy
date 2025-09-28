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
    public class RoleController : ControllerBase
    {
        IServiceManager _service;
        public RoleController(IServiceManager service)
        {
            _service = service;
        }
        [HttpGet("all-role")]
        public IActionResult GetAllRoles()
        {
            var roles = _service.RoleService.GetAllRoles();
            return Ok(roles);
        }
        [HttpGet("role/{id:int}")]
        public IActionResult GetRole([FromRoute]int id)
        {
            var role = _service.RoleService.GetRole(id);
            return Ok(role);
        }
        [HttpPost("create-role")]
        public IActionResult CreateRole([FromBody] RoleCreateDTO dto)
        {
            var role = _service.RoleService.CreateRole(dto);
            return Ok(role);
        }
        [HttpPut("update-role")]
        public IActionResult UpdateRole([FromBody] RoleUpdateDTO dto)
        {
            var role = _service.RoleService.UpdateRole(dto);
            return Ok(role);
        }

    }
}
