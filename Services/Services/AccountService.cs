using AutoMapper;
using Entities.DTO;
using Entities.Models;
using Repositories.Contracts;
using Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class AccountService : IAccountService
    {
        IRepositoryManager _manager;
        IMapper _mapper;
        public AccountService(IRepositoryManager manager,IMapper mapper) 
        {
            _mapper = mapper;
            _manager = manager;
        }

        public AccountDTO CreateAccount(AccountCreateDTO dto)
        {
            var entity = _mapper.Map<Account>(dto);

            _manager.Account.Create(entity);
            _manager.Save();

            return _mapper.Map<AccountDTO>(entity);
        }

        public AccountDTO GetAccountById(int id)
        {
            var entity = _manager.Account.FindByCondition(u=>u.Id == id, false);

            return _mapper.Map<AccountDTO>(entity);
        }

        public AccountDTO GetAccountByNumber(string number)
        {
            var entity = _manager.Account.FindByCondition(u => u.Userno == number, false);
            return _mapper.Map<AccountDTO>(entity);
        }

        public IQueryable<AccountDTO> GetAllAccount()
        {
            var entity = _manager.Account.FindAll(false);

            return _mapper.ProjectTo<AccountDTO>(entity);
        }

        public AccountDTO UpdateAccount(AccountUpdateDTO dto,int id)
        {
            var entity = _manager.Account.FindByCondition(u => u.Id == id, false);

            _mapper.Map(dto, entity);

            _manager.Account.Update(entity);
            _manager.Save();

            return _mapper.Map<AccountDTO>(entity);
        }
    }
}