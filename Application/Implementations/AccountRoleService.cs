using AutoMapper;
using Domain.Entities;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contracts.DTOs;
using Application.Contracts;
using Domain.Interfaces;

namespace Application.Implementations
{
    public class AccountRoleService : IAccountRoleService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;
        
        public AccountRoleService(IRepositoryManager repository, IMapper mapper)
        {
            _mapper = mapper;
            _repository = repository;
        }

        public IQueryable<AccountRoleDTO> GetAllAccountRoles()
        {
            var entities = _repository.AccountRole.FindAll(false);
            return _mapper.ProjectTo<AccountRoleDTO>(entities);
        }

        public AccountRoleDTO GetAccountRoleById(int id)
        {
            var entity = _repository.AccountRole.FindByCondition(ar => ar.Id == id, false);
            return _mapper.Map<AccountRoleDTO>(entity);
        }

        public IQueryable<AccountRoleDTO> GetAccountRolesByAccountId(int accountId)
        {
            var entities = _repository.AccountRole.FindAllByCondition(ar => ar.AccountId == accountId, false);
            return _mapper.ProjectTo<AccountRoleDTO>(entities);
        }

        public IQueryable<AccountRoleDTO> GetAccountRolesByRoleId(int roleId)
        {
            var entities = _repository.AccountRole.FindAllByCondition(ar => ar.RoleId == roleId, false);
            return _mapper.ProjectTo<AccountRoleDTO>(entities);
        }

        public AccountRoleDTO CreateAccountRole(AccountRoleCreateDTO dto)
        {
            var entity = _mapper.Map<AccountRole>(dto);

            _repository.AccountRole.Create(entity);
            _repository.Save();

            return _mapper.Map<AccountRoleDTO>(entity);
        }

        public AccountRoleDTO UpdateAccountRole(AccountRoleUpdateDTO dto, int id)
        {
            var entity = _repository.AccountRole.FindByCondition(ar => ar.Id == id, false);
            if (entity == null)
                return null;

            _mapper.Map(dto, entity);
            _repository.AccountRole.Update(entity);
            _repository.Save();

            return _mapper.Map<AccountRoleDTO>(entity);
        }

        public void DeleteAccountRole(int id)
        {
            var entity = _repository.AccountRole.FindByCondition(ar => ar.Id == id, false);
            if (entity != null)
            {
                _repository.AccountRole.Delete(entity);
                _repository.Save();
            }
        }
    }
}
