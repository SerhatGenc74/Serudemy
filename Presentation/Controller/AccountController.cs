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
    public class AccountController : ControllerBase
    {
        IServiceManager _service;
        public AccountController(IServiceManager service)
        { 
            _service = service;
        }
        [HttpPost]
        public IActionResult CreateAccount([FromBody] AccountCreateDTO dto)
        {
            var accounts = _service.AccountService.CreateAccount(dto);
            return Ok(accounts);
        }
        [HttpGet]
        public IActionResult GetAllAccount()
        {
            var account = _service.AccountService.GetAllAccount();
            return Ok(account);
        }
        [HttpPut("{id:int}")]
        public IActionResult UpdateAccount([FromBody] AccountUpdateDTO dto,[FromRoute(Name ="id")]int id )
        {
            var account = _service.AccountService.UpdateAccount(dto,id);
            return Ok(account);
        }
        [HttpGet("{id:int}")]
        public IActionResult GetAccountById([FromRoute(Name = "id")] int id)
        {
            var account = _service.AccountService.GetAccountById(id);
            return Ok(account);
        }
        [HttpGet("{number}")]
        public IActionResult GetAccountByNumber([FromRoute(Name = "number")]string number)
        {
            var account = _service.AccountService.GetAccountByNumber(number);
            return Ok(account);
        }
    }
}
