using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Serudemy.Controllers
{
    [Authorize]
    public class ProfilController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
