using Contracts.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Contracts
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


    }
}
