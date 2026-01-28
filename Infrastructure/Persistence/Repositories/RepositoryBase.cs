using Domain.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public abstract class RepositoryBase<T> : IRepositoryBase<T>
        where T : class
    {
        protected readonly SerudemyContext _context;
        public RepositoryBase(SerudemyContext context)
        {
            _context = context;
        }

        #region Synchronous Methods

        public IQueryable<T> FindAll(bool trackChanges) =>
            !trackChanges ? _context.Set<T>().AsNoTracking() : _context.Set<T>();

        public IQueryable<T> FindAllByCondition(Expression<Func<T, bool>> expression, bool trackChanges) =>
            !trackChanges ? _context.Set<T>().Where(expression).AsNoTracking() : _context.Set<T>().Where(expression);

        public T? FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges) =>
            !trackChanges ? _context.Set<T>().Where(expression).AsNoTracking().FirstOrDefault()
                         : _context.Set<T>().Where(expression).FirstOrDefault();

        public void Create(T entity) => _context.Set<T>().Add(entity);

        public void Update(T entity) => _context.Set<T>().Update(entity);

        public void Delete(T entity) => _context.Set<T>().Remove(entity);

        #endregion

        #region Asynchronous Methods

        public async Task<IEnumerable<T>> FindAllAsync(bool trackChanges = true)
        {
            return trackChanges
                ? await _context.Set<T>().ToListAsync()
                : await _context.Set<T>().AsNoTracking().ToListAsync();
        }

        public async Task<IEnumerable<T>> FindByConditionAsync(Expression<Func<T, bool>> expression, bool trackChanges = true)
        {
            return trackChanges
                ? await _context.Set<T>().Where(expression).ToListAsync()
                : await _context.Set<T>().Where(expression).AsNoTracking().ToListAsync();
        }

        public async Task<T?> FindSingleByConditionAsync(Expression<Func<T, bool>> expression, bool trackChanges = true)
        {
            return trackChanges
                ? await _context.Set<T>().Where(expression).FirstOrDefaultAsync()
                : await _context.Set<T>().Where(expression).AsNoTracking().FirstOrDefaultAsync();
        }

        public async Task<T?> FindByIdAsync(object id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task<bool> ExistsAsync(Expression<Func<T, bool>> expression)
        {
            return await _context.Set<T>().AnyAsync(expression);
        }

        public async Task<int> CountAsync(Expression<Func<T, bool>>? expression = null)
        {
            return expression == null
                ? await _context.Set<T>().CountAsync()
                : await _context.Set<T>().CountAsync(expression);
        }

        #endregion

    }
}
