using System.Diagnostics;
using System.Security.Claims;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Serudemy.DAL;


namespace Serudemy.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        SerudemyContext context;
        public HomeController(SerudemyContext context, ILogger<HomeController> logger)
        {
            this.context = context;
            _logger = logger;
        }
        /*
        public IActionResult Index()
        {
            try
            {
            var course = context.Courses.ToList();
            return View(course);
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Bir hata oluþtu:" + ex.Message;
                return RedirectToAction("Index", "Error");
            }
            
            
        }
        public IActionResult KursDetay(int? CourseId)
        {
            try
            {
                var user = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
                int userId = Convert.ToInt32(user);
                //Kurs Var mý Kontrolü
                var haveacourse = context.StudentCourses.FirstOrDefault(u => u.CoursesId == CourseId && u.AccountId == userId);
                ViewBag.HaveACourse = haveacourse;
                
                //getLastProgressWithLecture
                var lastProgress = context.StudentProgresses
                    .Include(sp => sp.Lectures)
                    .Where(sp => sp.AccountId == userId && sp.Lectures.CoursesId == CourseId)
                    .OrderByDescending(sp => sp.LastUpdate)
                    .FirstOrDefault();

                if(lastProgress == null)
                {
                    //Ýlk dersin Id si
                    var Lecture = context.Lectures.Where(u => u.CoursesId == CourseId).FirstOrDefault(u => u.LectureOrder == 1)?.Id;
                    ViewBag.LessonId = Lecture;
                }
                else
                {
                    //En son izlenen dersin Id si
                    ViewBag.LessonId = lastProgress.LecturesId;
                }

                ViewBag.DersSayisi = context.Lectures.Count(u => u.CoursesId == CourseId);
                //ViewBag.ToplamSaat =
                //Burasý toplam video süresi için eklenecek 
                var course = context.Courses
                        .Include(c => c.Lectures)
                        .Include(c => c.StudentCourses)
                        .FirstOrDefault(c => c.CourseId == CourseId);

                //Kursun varlýðýný kontrol et
                if (course == null)
                {
                    throw new Exception("Ýlgili Kurs Bulunamadý");
                }

                var selectedlecture = context.Lectures.FirstOrDefault(c => c.CoursesId == CourseId);
                var courseViewModel = new CourseViewModel
                {
                    CourseId = course.CourseId,
                    Name = course.Name,
                    Description = course.Description,
                    ImageUrl = course.ImageUrl,
                    Lectures = course.Lectures.Select(l => new LectureViewModel
                    {
                        Id = l.Id,
                        Name = l.Name,
                        VideoUrl = l.VideoUrl
                    }).ToList(),
                    CourseOwner = context.Accounts.FirstOrDefault(a=>a.Id == course.CourseOwnerId),
                    SelectedLecture = new LectureViewModel
                    {
                        Id = selectedlecture.Id,
                        Name = selectedlecture.Name,
                        VideoDesc = selectedlecture.VideoDesc,
                        VideoName = selectedlecture.VideoName,
                        VideoUrl = selectedlecture.VideoUrl
                    },
                    StudentCourses = haveacourse
                };
                
                return View(courseViewModel);
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Bir hata oluþtu:" + ex.Message;
                return RedirectToAction("Index","Error");
            }
                
        }
        [HttpPost]
        [Authorize]
        public IActionResult KursKatil(int? CourseId)
        {
            try
            {
                var userData = HttpContext.User;
                var userId = userData.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
                var user = Convert.ToInt32(userId);

                bool isalreadyjoined = context.StudentCourses
                 .Any(sc => sc.AccountId == user && sc.CoursesId == CourseId);
                if (!isalreadyjoined)
                {
                    var studentcourse = new StudentCourse
                    {
                        AccountId = user,
                        CoursesId = CourseId,
                        CourseCompleted = false
                    };
                    context.StudentCourses.Add(studentcourse);
                    context.SaveChanges();
                }
                return RedirectToAction("Index", "Home");
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Bir hata oluþtu:" + ex.Message;
                return RedirectToAction("Index", "Error");
            }
             
        }
        [HttpPut]
        public async Task<IActionResult> DersIlerlemeUpdater(int AccountId,int LecturesId,[FromBody]StudentProgressDTO data)
        {
            
            var entity = new StudentProgress
            {
                AccountId = data.AccountId,
                LecturesId = data.LecturesId,
                ProgressPerc = data.ProgressPerc,
                LecturesCompleted = data.LecturesCompleted,
                WatchedSeconds = data.WatchedSeconds,
                PlaybackPosition = data.PlaybackPosition,
                LastUpdate = BitConverter.GetBytes(DateTime.UtcNow.Ticks)
            };
            var oldData = context.StudentProgresses
                 .FirstOrDefault(sp => sp.AccountId == data.AccountId && sp.LecturesId == data.LecturesId);
            
            
             if (oldData == null)
             {
                context.StudentProgresses.Add(entity);
                
             }
             else
             {
                oldData.ProgressPerc = data.ProgressPerc;
                oldData.LecturesCompleted = data.LecturesCompleted;
                oldData.WatchedSeconds = data.WatchedSeconds;
                oldData.PlaybackPosition = data.PlaybackPosition;
                oldData.LastUpdate = BitConverter.GetBytes(DateTime.UtcNow.Ticks);
                context.StudentProgresses.Update(oldData);
             }

            await context.SaveChangesAsync();

            if (oldData.PlaybackPosition > data.PlaybackPosition)
            {
                //do nothing
                return Json(new
                {
                    succes = false,
                    message = "Ýlerleme Güncellenmeyecek. Video Geri sarýldý.",
                    data = new
                    {
                        data.AccountId,
                        data.LecturesId,
                        data.ProgressPerc,
                        data.LecturesCompleted,
                        data.WatchedSeconds,
                        data.PlaybackPosition,
                        data.LastUpdate
                    }
                });
            }


            Console.WriteLine(JsonConvert.SerializeObject(data));

            return Json(new
            {
                succes = true,
                message = "Ýlerleme güncellendi.",
                data = new
                {
                    data.AccountId,
                    data.LecturesId,
                    data.ProgressPerc,
                    data.LecturesCompleted,
                    data.WatchedSeconds,
                    data.PlaybackPosition,
                    data.LastUpdate
                }
            });
        }
        public IActionResult DersVideosu(int LectureId)
        {
            
            try
            {
                var Userdata = HttpContext.User;
                var AccountId = int.Parse(Userdata.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value);
                var Playbacktime = context.StudentProgresses
                    .Where(sp => sp.AccountId == AccountId && sp.LecturesId == LectureId)
                    .Select(sp => sp.PlaybackPosition)
                    .FirstOrDefault();
                ViewBag.AccountId = AccountId;
                ViewBag.PlaybackTime = Playbacktime;
                var courseId = context.Lectures
                    .Where(l => l.Id == LectureId)
                    .Select(l => l.CoursesId)
                    .FirstOrDefault();
                //Aside nav bar için tüm dersleri listeleme sorgusu
                var allLectures = context.Lectures.Where(l=>l.CoursesId == courseId).ToList();
                //Ýlgili dersin videosunu getirmek için gerekli= h sorgu
                var lecture = context.Lectures.FirstOrDefault(l => l.Id == LectureId && courseId == l.CoursesId);

                if (lecture == null)
                {
                    throw new Exception("Ýlgili Ders Bulunamadý");
                }

                var lectureViewModel = new LectureViewModel
                {
                    Id = lecture.Id,
                    CourseId = courseId,
                    Name = lecture.Name,
                    VideoName = lecture.VideoName,
                    VideoDesc = lecture.VideoDesc,
                    VideoUrl = lecture.VideoUrl,
                    LectureOrder = lecture.LectureOrder,
                    AllLecture = allLectures 
                };
                return View(lectureViewModel);
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Bir hata oluþtu:" + ex.Message;
                return RedirectToAction("Index", "Error");
            }
            
        }
        [HttpPost]
        public IActionResult DersVideosu()
        {

            return View();
        }
       

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        */
    }
}
