using Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface IAccountService
    {
        public IQueryable<AccountDTO> GetAllAccount();
        public AccountDTO GetAccountById(int id);
        public AccountDTO GetAccountByNumber(string number);
        public AccountDTO CreateAccount(AccountCreateDTO dto);
        public AccountDTO UpdateAccount(AccountUpdateDTO dto, int id);
        public void DeleteAccount(int id);
    }
}