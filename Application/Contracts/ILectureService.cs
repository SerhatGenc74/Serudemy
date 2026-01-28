using Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface ILectureService
    {
        public double GetTotalLessonCount(int courseId);
        public IQueryable<LectureDTO> GetAllLectures();
        public IQueryable<LectureDTO> GetAllLectures(int courseId);
        public IQueryable<LectureDTO> GetAllLecturesWithCourse(int courseId);
        public LectureDTO GetLecture(int lectureId);
        public LectureDTO CreateLecture(LectureCreateDTO lecture);
        public LectureDTO UpdateLecture(LectureUpdateDTO lecture,int lectureId);
        public bool DeleteLecture(int lectureId);
        public bool ReorderLecture(int lectureId, int newOrder);
        public LectureDTO GetFirstLecture(int courseId);
        
        public int PublishScheduledLectures();
        public IQueryable<LectureDTO> GetPublishedLectures(int courseId);
        public IQueryable<LectureDTO> GetAllLecturesForInstructor(int courseId);
        public IQueryable<LectureDTO> GetScheduledLectures(int courseId);
        public IQueryable<LectureDTO> GetLecturesForStudent(int courseId); 
        
        // Student-safe methods - Sadece erişilebilir ve yayınlanmış içerikleri döndürür
        public LectureDTO GetLectureForStudent(int lectureId, int courseId);
        
        // Lecture status management (Taslak/Yayınlanma/Arşiv)
        public LectureDTO PublishLecture(int lectureId);
        public LectureDTO UnpublishLecture(int lectureId);
        public LectureDTO ArchiveLecture(int lectureId);
        public LectureDTO SetLectureAccessibility(int lectureId, bool isAccessible);
        public IQueryable<LectureDTO> GetPublishedLecturesByStatus(int courseId);
        public IQueryable<LectureDTO> GetAccessibleLectures(int courseId);
    }
}
