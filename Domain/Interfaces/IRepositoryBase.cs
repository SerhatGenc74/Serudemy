using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IRepositoryBase<T> where T : class
    {
        // Synchronous Methods
        IQueryable<T> FindAll(bool trackChanges);
        IQueryable<T> FindAllByCondition(Expression<Func<T, bool>> expression, bool trackChanges);
        T? FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges);
        void Create(T entity);
        void Update(T entity);
        void Delete(T entity);

        // Asynchronous Methods
        Task<IEnumerable<T>> FindAllAsync(bool trackChanges = true);
        Task<IEnumerable<T>> FindByConditionAsync(Expression<Func<T, bool>> expression, bool trackChanges = true);
        Task<T?> FindSingleByConditionAsync(Expression<Func<T, bool>> expression, bool trackChanges = true);
        Task<T?> FindByIdAsync(object id);
        Task<bool> ExistsAsync(Expression<Func<T, bool>> expression);
        Task<int> CountAsync(Expression<Func<T, bool>>? expression = null);
    }
}
