using Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface IStudentProgressService
    {
        public IQueryable<StudentProgressDTO> GetAllStudentProgress();
        public StudentProgressDTO GetStudentProgressById(int id);
        public StudentProgressDTO GetStudentProgress(int studentId, int lectureId);
        public IQueryable<StudentProgressDTO> GetAllStudentProgressWithLecture();
        public IQueryable<StudentProgressDTO> GetCompletedLessons(int studentId, int courseId);
        public IQueryable<StudentProgressDTO> GetStudentProgressByStudentId(int studentId);
        public IQueryable<StudentProgressDTO> GetStudentProgressByLectureId(int lectureId);
        public IQueryable<StudentProgressDTO> GetStudentProgressInCourse(int studentId, int courseId);
        public void MarkLessonAsCompleted(int studentId, int lessonId);
        public int GetCompletedLessonCount(int studentId, int courseId);
        public double GetProgressPercentage(int studentId, int courseId);
        public void UpdatePlaybackPosition(int studentId, int lectureId, int position);
        public int GetPlaybackPosition(int studentId, int lectureId);
        public StudentProgressDTO CreateStudentProgress(StudentProgressCreateDTO dto);
        public StudentProgressDTO UpdateStudentProgress(StudentProgressUpdateDTO dto, int id);
        public void DeleteStudentProgress(int id);
        public StudentProgressDTO GetLastProgressWithLecture(int accountId, int courseId);
        public StudentProgressDTO IsAlreadyHaveProgress(int studentId,int lectureId);
        public object GetCourseProgressOverview(int courseId);
    }
}
