using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;

namespace Serudemy.Controllers
{
    public class GirisController : Controller
    {
        IHttpContextAccessor httpContextAccessor;
        /*
        [HttpPost]
        public IActionResult Index(Login model)
        {
            var user = db.Accounts.FirstOrDefault(u => u.UserEmail == model.Email && u.Password == model.Password);
            if (user != null)
            {
                //getAccountRole
            var accountRole = db.AccountRoles.FirstOrDefault(u => u.AccountId == user.Id );
                var claims = new List<Claim>
                {
                    new Claim("UserId",user.Id.ToString()),
                    new Claim("Role", accountRole.RoleId.ToString()),
                    new Claim(ClaimTypes.Name, user.Name)
                };
                    
                var identity = new ClaimsIdentity(
                    claims,
                    "cookie",
                    ClaimTypes.Name,
                    "Role"
                    );
                var principal = new ClaimsPrincipal(identity);

                httpContextAccessor.HttpContext.SignInAsync(principal);

                
                return View();
                
            }
            else
            {
                return View();
            }
            
        }
        */
        public IActionResult Cikis()
        {
            httpContextAccessor.HttpContext.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }
        public IActionResult ErisimReddi()
        {
            return View();
        }
        public IActionResult Kayit()
        {
            return View();
        }
        /*
        [HttpPost]
        public IActionResult Kayit(Account hesap,int Ogretmenmi)
        {
            AccountRole ar = new AccountRole();
            db.Accounts.Add(hesap);
            db.SaveChanges();
            ar.AccountId = hesap.Id;
            if (Ogretmenmi == 1)
            {
                ar.RoleId = 3; // Öğretmen rolü
            }
            else
            {
                ar.RoleId = 2; // Öğrenci rolü
            }
            db.AccountRoles.Add(ar);
            db.SaveChanges();
            return View("Index");
        }
        */
    }
}
