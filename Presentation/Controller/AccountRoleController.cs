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
    public class AccountRoleController : ControllerBase
    {
        private readonly IServiceManager _service;
        
        public AccountRoleController(IServiceManager service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAllAccountRoles()
        {
            var accountRoles = _service.AccountRoleService.GetAllAccountRoles();
            return Ok(accountRoles);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetAccountRoleById([FromRoute(Name = "id")] int id)
        {
            var accountRole = _service.AccountRoleService.GetAccountRoleById(id);
            if (accountRole == null)
                return NotFound();
            return Ok(accountRole);
        }

        [HttpGet("account/{accountId:int}")]
        public IActionResult GetAccountRolesByAccountId([FromRoute(Name = "accountId")] int accountId)
        {
            var accountRoles = _service.AccountRoleService.GetAccountRolesByAccountId(accountId);
            return Ok(accountRoles);
        }

        [HttpGet("role/{roleId:int}")]
        public IActionResult GetAccountRolesByRoleId([FromRoute(Name = "roleId")] int roleId)
        {
            var accountRoles = _service.AccountRoleService.GetAccountRolesByRoleId(roleId);
            return Ok(accountRoles);
        }

        [HttpPost]
        public IActionResult CreateAccountRole([FromBody] AccountRoleCreateDTO dto)
        {
            var accountRole = _service.AccountRoleService.CreateAccountRole(dto);
            return CreatedAtAction(nameof(GetAccountRoleById), new { id = accountRole.Id }, accountRole);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateAccountRole([FromRoute(Name = "id")] int id, [FromBody] AccountRoleUpdateDTO dto)
        {
            var accountRole = _service.AccountRoleService.UpdateAccountRole(dto, id);
            if (accountRole == null)
                return NotFound();
            return Ok(accountRole);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteAccountRole([FromRoute(Name = "id")] int id)
        {
            _service.AccountRoleService.DeleteAccountRole(id);
            return NoContent();
        }
    }
}