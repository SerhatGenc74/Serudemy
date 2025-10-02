using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Serudemy.Controllers
{
    [Authorize]
    public class AdminController : Controller
    {

        //Dependency Injection
        public AdminController()
        {
            //db = manager;
        }
        /*
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> Kullanici()
        {
            //getAllAccountRoles
            var Students = await db.AccountRoles
                .Include(k => k.Account)
                .Include(k => k.Role)
                .ToListAsync();

            return View(Students);
        }
        
        [HttpPost]
        public IActionResult Kullanici(int id)
        {
            var student = db.Accounts.Find(id);
            return View(student);
        }
        public IActionResult KullaniciDuzenle(int id)
        {
            var student = db.AccountRoles
                .Include(k => k.Account)
                .Include(k => k.Role)
                .FirstOrDefault(u => u.AccountId == id);
            return View(student);
        }
        [HttpPost]
        public async Task<IActionResult> KullaniciDuzenle(AccountRole accountRole)
        {
                db.AccountRoles.Update(accountRole);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            
        }
        public IActionResult KullaniciSil(int id)
        {
            
            var Account = db.Accounts.Find(id);
            var Accountrole = db.AccountRoles.FirstOrDefault(ar=> ar.AccountId == id);
            var studentProgress = db.StudentProgresses.FirstOrDefault(ar => ar.AccountId == id);
            var StudentCourse = db.StudentCourses.FirstOrDefault(ar => ar.AccountId == id);
            var Course = db.Courses.FirstOrDefault(ar => ar.CourseOwnerId == id);

            //Öğrenciyse Kurslarını Sil
            if (Accountrole.RoleId == 3)
            {
                db.StudentCourses.Remove(StudentCourse);
                db.SaveChanges();
            }
                
            //Öğretmense Kursları Sil
            if (Accountrole.RoleId == 4)
            {
                db.Courses.Remove(Course);
                db.SaveChanges();
            }

            db.AccountRoles.Remove(Accountrole);
            db.SaveChanges();

            db.Accounts.Remove(Account);
            db.SaveChanges();
           
            return View();
        }




        public IActionResult Rol()
        {
            var roles = db.Roles.ToList();
            return View(roles);
        }
        [HttpPost]
        public IActionResult Rol(int id)
        {
            var find = db.Roles.Find(id);
            return View(find);
        }
        public IActionResult RolDuzenle(int id)
        {
           var kullanici = db.Roles.Find(id);
            return View(kullanici);
        }
        [HttpPost]
        public IActionResult RolDuzenle(Role role)
        {
            db.Roles.Update(role);
            db.SaveChanges();
            return RedirectToAction("Rol");
        }
        public IActionResult RolEkle()
        {
            return View();
        }
        [HttpPost]
        public IActionResult RolEkle(Role rol)
        {
            db.Roles.Add(rol);
            db.SaveChanges();
            return View();
        }
        public IActionResult RolSil(int id)
        {
            var rol = db.Roles.Find(id);
            try
            {
                db.Roles.Remove(rol);
                db.SaveChanges();
            }
            catch (Exception ex)
            {

                throw new Exception("Bu rol silinemez. Bu role atanmış kullanıcılar var.");
            }
            
            return RedirectToAction("Rol");
        }
        */
    }
}
