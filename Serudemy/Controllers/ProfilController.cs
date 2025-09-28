using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serudemy.DAL;

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
            var Userdata = HttpContext.User;
            var userId = int.Parse(Userdata.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value);
            
            var course = context.StudentCourses.Include(c=>c.Account).Include(c=>c.Courses).Where(sc=>sc.AccountId == userId).ToList();

            return View(course);
        }
    }
}
