using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Metadata;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serudemy.Services;
using System.Collections.Generic;
using System.Security.Claims;
using Repositories.Infrastructure;

namespace Serudemy.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        SerudemyContext context;

        public DashboardController(SerudemyContext context)
        {
            this.context = context;
        }
        /*
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult KursuAlan(int courseId)
        {
            try
            {

                var FinishedCourseCount = context.StudentProgresses.Count(u => u.LecturesCompleted == true);
                var AllLectureCount= context.Lectures.Count(u=>u.CoursesId == courseId);

                ViewBag.finishedCount = FinishedCourseCount;
                ViewBag.AllLecture = AllLectureCount; 

                //getCourseWithAccount
                var CourseUser = context.Courses.Include(c => c.StudentCourses).ThenInclude(c => c.Account).FirstOrDefault(u => u.CourseId == courseId);
                var viewmodel = CourseUser.StudentCourses.Select(u => new StudentViewModel
                {
                    AccountId = u.AccountId,
                    CourseId = u.CoursesId,
                    Name = u.Account.Name,
                    Surname = u.Account.Surname,
                    UserEmail = u.Account.UserEmail,
                    Userno = u.Account.Userno
                }).ToList();
                return View(viewmodel);
            }
            catch (Exception ex)
            {

                TempData["ErrorMessage"] = "Bir hata oluştu:" + ex.Message;
                return RedirectToAction("Index", "Error");
            }

        }
        public IActionResult DersIlerleme(int CourseID, int AccountID)
        {

            var FinishedCourseCount = context.StudentProgresses.Count(u => u.LecturesCompleted == true);
            var AllLectureCount = context.Lectures.Count(u => u.CoursesId == CourseID);
            var ProgressPerc = (FinishedCourseCount / AllLectureCount) * 100;

            @ViewBag.FinishedCourseCount = FinishedCourseCount;
                @ViewBag.AllLecture = AllLectureCount;
            @ViewBag.ProgressPerc = ProgressPerc;


                
            var course = context.Courses.Include(c => c.Lectures).FirstOrDefault(c => c.CourseId == CourseID);
                if (course == null)
                {
                    throw new Exception("İlgili kurs bulunamadı");
                }

            var account = context.Accounts.FirstOrDefault(u => u.Id == AccountID);

            var sp = context.StudentProgresses
            .Include(u => u.Lectures)
            .Where(u => u.AccountId == AccountID && u.Lectures.CoursesId == CourseID)
            .ToList();

            var viewmodel = new StudentProgressViewModel
            {
                Account = account,
                CourseId = CourseID,
                lecture = course.Lectures.ToList(),
                Progresses = sp

            };
                return View(viewmodel);
            
        }
        public IActionResult Dersler(int CourseId)
        {
            try
            {
                var course = context.Courses.Include(c => c.Lectures).FirstOrDefault(c => c.CourseId == CourseId);

                if (course == null)
                {
                    throw new Exception("İlgili kurs bulunamadı");
                }
                var viewmodel = new CourseViewModel
                {
                    CourseId = course.CourseId,
                    Name = course.Name,
                    ImageUrl = course.ImageUrl,
                    Description = course.Description,

                    Lectures = course.Lectures.Select(l => new LectureViewModel
                    {
                        Id = l.Id,
                        Name = l.Name,
                        VideoName = l.VideoName,
                        VideoDesc = l.VideoDesc,
                        VideoUrl = l.VideoUrl
                    }).ToList()

                };


                return View(viewmodel);

            }
            catch (Exception ex)
            {

                TempData["ErrorMessage"] = "Bir hata oluştu:" + ex.Message;
                return RedirectToAction("Index", "Error");
            }

        }
        public IActionResult DersEkle(int CourseId)
        {
            ViewBag.CourseId = CourseId;
            ViewBag.CourseTitle = context.Courses.FirstOrDefault(c => c.CourseId == CourseId)?.Name;

            return View();
        }
        [HttpPost]
        public async Task<IActionResult> DersEkle(Lecture lecture, IFormFile VideoUrl, int CourseId)
        {
            try
            {
                DersIslem islem = new DersIslem();
                int LectureCount = context.Lectures.Count(u => u.CoursesId == CourseId);
                await islem.Dersislem(lecture, CourseId, VideoUrl, LectureCount);
                return RedirectToAction("Dersler", "Dashboard", new { CourseId });
            }
            catch (Exception ex)
            {

                TempData["ErrorMessage"] = "Bir hata oluştu:" + ex.Message;
                return RedirectToAction("Index", "Error");
            }

        }
        public IActionResult DersDuzenle(int LectureID)
        {
            try
            {
                var ders = context.Lectures.FirstOrDefault(u => u.Id == LectureID);
                return View(ders);
            }
            catch (Exception ex)
            {

                TempData["ErrorMessage"] = "Bir hata oluştu:" + ex.Message;
                return RedirectToAction("Index", "Error");
            }

        }
        [HttpPost]
        public async Task<IActionResult> DersDuzenle(IFormFile file, Lecture lecture)
        {
            try
            {
                if (file != null)
                {
                    if (Path.GetExtension(file.FileName) == ".mp4")
                    {
                        Guid guid = Guid.NewGuid();
                        string extension = Path.GetExtension(file.FileName).ToLower();
                        string filename = guid.ToString() + extension;

                        if (file != null && file.Length > 0)
                        {
                            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Videos", filename);
                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }
                        }

                        var dbfilePath = Path.Combine("/Videos/" + filename);
                        lecture.VideoUrl = dbfilePath;
                        lecture.VideoName = file.FileName;
                    }
                }
                context.Lectures.Update(lecture);
                context.SaveChanges();
                return RedirectToAction("Dersler", "Dashboard", new { lecture.CoursesId });
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Bir hata oluştu:" + ex.Message;
                return RedirectToAction("Index", "Error");

            }

        }

        [HttpGet]
        public IActionResult DersSil(int LessonId)
        {
            try
            {
                var lecture = context.Lectures.Find(LessonId);
                if (!(LessonId <= 0) && lecture != null)
                {
                    context.Lectures.Remove(lecture);
                    context.SaveChanges();
                }
                return View();
            }
            catch (Exception ex)
            {

                TempData["ErrorMessage"] = "Bir hata oluştu:" + ex.Message;
                return RedirectToAction("Index", "Error");
            }

        }

        public IActionResult Kurslar()
        {
          
            var Courses = context.Courses.Where(u => u.CourseOwnerId == CurrentUser.UserId).ToList();
            return View(Courses);
        }
        public IActionResult KursEkle()
        {   
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> KursEkle(Course kurs, IFormFile file)
        {
            try
            {
                KursIslem islem = new KursIslem();
                await islem.KursEkleme(kurs, file);
                int CourseId = kurs.CourseId;
                return RedirectToAction("Dersler", "Dashboard", new { CourseId });
            }
            catch (Exception ex)
            {

                TempData["ErrorMessage"] = "Bir hata oluştu:" + ex.Message;
                return RedirectToAction("Index", "Error");
            }

        }

        public IActionResult KursDuzenle(int Id)
        {
            try
            {
                var course = context.Courses
                               .Include(c => c.Lectures)
                               .FirstOrDefault(c => c.CourseId == Id);

                if (course == null)
                {
                    throw new Exception("ilgili kurs boş");
                }
                ;

                var viewmodel = new CourseViewModel
                {
                    CourseId = course.CourseId,
                    Name = course.Name,
                    Description = course.Description,
                    Lectures = course.Lectures.Select(l => new LectureViewModel
                    {
                        Id = l.Id,
                        Name = l.Name,
                        VideoName = l.VideoName,
                        VideoDesc = l.VideoDesc,
                        VideoUrl = l.VideoUrl
                    }).ToList()
                };
                return View(viewmodel);

            }
            catch (Exception ex)
            {

                TempData["ErrorMessage"] = "Bir hata oluştu:" + ex.Message;
                return RedirectToAction("Index", "Error");
            }

        }
        [HttpPost]
        public IActionResult KursDuzenle(CourseViewModel model, IFormFile FotoUrl)
        {

            var course = context.Courses.Include(c => c.Lectures).FirstOrDefault(c => c.CourseId == model.CourseId);
            if (course == null) return NotFound();
            course.Name = model.Name;
            course.Description = model.Description;


            context.SaveChanges();
            return RedirectToAction("Kurslar");
        }

        public IActionResult KursDetay(int Id)
        {
            var courseDetail = context.Courses.Include(c => c.Lectures).FirstOrDefault(c => c.CourseId == Id);
            if (courseDetail == null) return NotFound();

            var viewmodel = new CourseViewModel
            {
                CourseId = courseDetail.CourseId,
                Name = courseDetail.Name,
                Description = courseDetail.Description,
                Lectures = courseDetail.Lectures.Select(l => new LectureViewModel
                {
                    Id = l.Id,
                    Name = l.Name,
                    VideoName = l.VideoName,
                    VideoDesc = l.VideoDesc,
                    VideoUrl = l.VideoUrl
                }).ToList()
            };


            return View(viewmodel);
        }
        [HttpPost]
        public IActionResult KursSil(int courseId)
        {
            var kurs = context.Courses.Find(courseId);
            var dersler = context.Lectures.Where(l => l.CoursesId == courseId);
            context.Lectures.RemoveRange(dersler);

            context.Courses.Remove(kurs);
            context.SaveChanges();
            return RedirectToAction("Kurslar");
        }
        */
    }
}
