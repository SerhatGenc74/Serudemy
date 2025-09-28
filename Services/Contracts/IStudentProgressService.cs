using Entities.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Contracts
{
    public interface IStudentProgressService
    {
        public IQueryable<StudentProgressDTO> GetAllStudentProgress();
        public StudentProgressDTO GetStudentProgress(int studentId, int lectureId);
        public IQueryable<StudentProgressDTO> GetAllStudentProgressWithLecture();
        public IQueryable<StudentProgressDTO> GetCompletedLessons(int studentId, int courseId);
        public void MarkLessonAsCompleted(int studentId, int lessonId);
        public int GetCompletedLessonCount(int studentId, int courseId);
        public double GetProgressPercentage(int studentId, int courseId);
        public int GetPlaybackPosition(int studentId, int lectureId);
        public StudentProgressDTO CreateStudentProgress(StudentProgressCreateDTO dto);
        public StudentProgressDTO UpdateStudentProgress(StudentProgressUpdateDTO dto);
        public StudentProgressDTO GetLastProgressWithLecture(int accountId, int courseId);
    }
}
