using Application.Contracts;
using Contracts.DTOs;
using Microsoft.AspNetCore.Authorization;
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
    public class AccountController : ControllerBase
    {
        private readonly IServiceManager _service;
        
        public AccountController(IServiceManager service)
        { 
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAllAccount()
        {
            var accounts = _service.AccountService.GetAllAccount();
            return Ok(accounts);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetAccountById([FromRoute(Name = "id")] int id)
        {
            var account = _service.AccountService.GetAccountById(id);
            if (account == null)
                return NotFound();
            return Ok(account);
        }

        [HttpGet("number/{number}")]
        public IActionResult GetAccountByNumber([FromRoute(Name = "number")] string number)
        {
            var account = _service.AccountService.GetAccountByNumber(number);
            if (account == null)
                return NotFound();
            return Ok(account);
        }

        [HttpPost]
        public IActionResult CreateAccount([FromBody] AccountCreateDTO dto)
        {
            var account = _service.AccountService.CreateAccount(dto);
            return CreatedAtAction(nameof(GetAccountById), new { id = account.Id }, account);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateAccount([FromRoute(Name = "id")] int id, [FromBody] AccountUpdateDTO dto)
        {
            var account = _service.AccountService.UpdateAccount(dto, id);
            if (account == null)
                return NotFound();
            return Ok(account);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteAccount([FromRoute(Name = "id")] int id)
        {
            _service.AccountService.DeleteAccount(id);
            return NoContent();
        }
    }
}
