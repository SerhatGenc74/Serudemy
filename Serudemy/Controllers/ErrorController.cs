using Microsoft.AspNetCore.Mvc;

namespace Serudemy.Controllers
{
    public class ErrorController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
