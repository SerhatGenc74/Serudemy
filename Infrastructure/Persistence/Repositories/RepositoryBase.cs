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

        public void Create(T entity) => _context.Set<T>().Add(entity);


        public void Delete(T entity) => _context.Set<T>().Remove(entity);

        public IQueryable<T> FindAll(bool trackChanges) => trackChanges ?
            _context.Set<T>() :
            _context.Set<T>().AsNoTracking();

        public IQueryable<T> FindAllByCondition(Expression<Func<T, bool>> expression, bool trackChanges) => !trackChanges ?
            _context.Set<T>().AsNoTracking().Where(expression) :
            _context.Set<T>().Where(expression);

        public T? FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges) => trackChanges ? 
            _context.Set<T>().FirstOrDefault(expression) :
            _context.Set<T>().AsNoTracking().FirstOrDefault(expression);

        public void Update(T entity) => _context.Set<T>().Update(entity);
    }
}
