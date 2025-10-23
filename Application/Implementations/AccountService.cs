using Application.Contracts;
using AutoMapper;
using Contracts.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Implementations
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
            var entity = _manager.Account
                .FindAllByCondition(u => u.Id == id, false)
                .Include(a => a.Department)
                    .ThenInclude(d => d.Faculty)
                .FirstOrDefault();

            return _mapper.Map<AccountDTO>(entity);
        }

        public AccountDTO GetAccountByNumber(string number)
        {
            var entity = _manager.Account
                .FindAllByCondition(u => u.Userno == number, false)
                .FirstOrDefault();
            return _mapper.Map<AccountDTO>(entity);
        }

        public IQueryable<AccountDTO> GetAllAccount()
        {
            var entity = _manager.Account
                .FindAll(false);

            return _mapper.ProjectTo<AccountDTO>(entity);
        }

        public AccountDTO UpdateAccount(AccountUpdateDTO dto,int id)
        {
            var entity = _manager.Account.FindByCondition(u => u.Id == id, false);
            if (entity == null)
                return null;

            _mapper.Map(dto, entity);

            _manager.Account.Update(entity);
            _manager.Save();

            return _mapper.Map<AccountDTO>(entity);
        }

        public void DeleteAccount(int id)
        {
            var entity = _manager.Account.FindByCondition(u => u.Id == id, false);
            if (entity != null)
            {
                _manager.Account.Delete(entity);
                _manager.Save();
            }
        }
    }
}