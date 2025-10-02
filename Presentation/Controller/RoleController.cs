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
    public class RoleController : ControllerBase
    {
        private readonly IServiceManager _service;
        
        public RoleController(IServiceManager service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAllRoles()
        {
            var roles = _service.RoleService.GetAllRoles();
            return Ok(roles);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetRole([FromRoute(Name = "id")] int id)
        {
            var role = _service.RoleService.GetRole(id);
            if (role == null)
                return NotFound();
            return Ok(role);
        }

        [HttpPost]
        public IActionResult CreateRole([FromBody] RoleCreateDTO dto)
        {
            var role = _service.RoleService.CreateRole(dto);
            return CreatedAtAction(nameof(GetRole), new { id = role.Id }, role);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateRole([FromRoute(Name = "id")] int id, [FromBody] RoleUpdateDTO dto)
        {
            var role = _service.RoleService.UpdateRole(dto, id);
            if (role == null)
                return NotFound();
            return Ok(role);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteRole([FromRoute(Name = "id")] int id)
        {
            _service.RoleService.DeleteRole(id);
            return NoContent();
        }
    }
}
