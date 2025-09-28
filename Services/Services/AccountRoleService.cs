using AutoMapper;
using Entities.DTO;
using Entities.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Repositories.Contracts;
using Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class AccountRoleService : IAccountRoleService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;
        public AccountRoleService(IRepositoryManager repository,IMapper _mapper)
        {
            this._mapper = _mapper;
            _repository = repository;
        }
        public AccountRoleDTO CreateAccountRole(AccountRoleCreateDTO dto)
        {
            var entity = _mapper.Map<Account>(dto);

            _repository.Account.Create(entity);
            _repository.Save();

            return _mapper.Map<AccountRoleDTO>(entity);
        }

        public void DeleteAccountRole(int id)
        {
            throw new NotImplementedException();
        }

        public AccountRoleDTO GetAccountRole()
        {
            var entity = _repository.AccountRole
                .FindAll(false)
                .FirstOrDefault();

            return _mapper.Map<AccountRoleDTO>(entity);
        }

        public IQueryable<AccountRoleDTO> GetAllAccountRoles()
        {
            var entity = _repository.AccountRole.FindAll(false);
            return _mapper.ProjectTo<AccountRoleDTO>(entity);
        }

        public AccountRoleDTO UpdateAccountRole(AccountRoleUpdateDTO dto)
        {
            var entity = _mapper.Map<AccountRole>(dto);

            _repository.AccountRole
               .Update(entity);
            _repository.Save();

            return _mapper.Map<AccountRoleDTO>(entity);
        }
    }
}
