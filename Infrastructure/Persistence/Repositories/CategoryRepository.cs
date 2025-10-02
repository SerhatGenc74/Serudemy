﻿using Domain.Entities;
using Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class CategoryRepository : RepositoryBase<Category>
    {
        public CategoryRepository(SerudemyContext context) : base(context)
        {
        }
    }
}
