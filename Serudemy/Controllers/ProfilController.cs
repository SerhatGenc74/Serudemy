using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repositories.Infrastructure;

namespace Serudemy.Controllers
{
    [Authorize]
    public class ProfilController : Controller
    {
        SerudemyContext context;
        public ProfilController(SerudemyContext context)
        {
            this.context = context;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
