using AutoMapper;
using Contracts.DTO;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class StudentProgressService : IStudentProgressService
    {
        IRepositoryManager _manager;
        IMapper _mapper;
        public StudentProgressService(IMapper mapper,IRepositoryManager manager)
        {
            _mapper = mapper;
            _manager = manager;
        }

        public IQueryable<StudentProgressDTO> GetAllStudentProgress()
        {
            var entity = _manager.StudentProgress.FindAll(false);

            return _mapper.ProjectTo<StudentProgressDTO>(entity);
        }

        public IQueryable<StudentProgressDTO> GetAllStudentProgressWithLecture()
        {
            var entity = _manager.StudentProgress.FindAll(false).Include(c=>c.Lectures);

            return _mapper.ProjectTo<StudentProgressDTO>(entity);
        }

        public int GetCompletedLessonCount(int studentId, int courseId)
        {
                var count = _manager.StudentProgress
                .FindAllByCondition(x => x.AccountId == studentId && x.Lectures!.CoursesId == courseId && x.LecturesCompleted == true, false)
                .Count();
            return count;
        }

        public IQueryable<StudentProgressDTO> GetCompletedLessons(int studentId, int courseId)
        {
            var entity = _manager.StudentProgress
                .FindAllByCondition(x => x.AccountId == studentId && x.Lectures!.CoursesId == courseId && x.LecturesCompleted == true, false);

            return _mapper.ProjectTo<StudentProgressDTO>(entity);

        }

        public StudentProgressDTO GetLastProgressWithLecture(int accountId, int courseId)
        {
            var entity = _manager.StudentProgress
                    .FindAllByCondition(sp => sp.AccountId == accountId && sp.Lectures!.CoursesId == courseId, false)
                    .Include(sp => sp.Lectures)
                    .OrderByDescending(c=>c.LastUpdate)
                    .FirstOrDefault();

            return _mapper.Map<StudentProgressDTO>(entity);
        }

        public int GetPlaybackPosition(int studentId, int lectureId)
        {
            var playbackPosition = _manager.StudentProgress
                .FindAllByCondition(x => x.AccountId == studentId && x.LecturesId == lectureId, false)
                .Select(x => x.PlaybackPosition)
                .FirstOrDefault();
            return playbackPosition;
        }

        public double GetProgressPercentage(int studentId, int courseId)
        {
            ILectureService service = new LectureService(_manager, _mapper);

            double totalLectures = service.GetTotalLessonCount(courseId); 
            if (totalLectures == 0) return 0;
            double completedLectures = GetCompletedLessonCount(studentId, courseId);

            return completedLectures / totalLectures * 100;
        }

        public StudentProgressDTO GetStudentProgress(int studentId, int lectureId)
        {
            var entity = _manager.StudentProgress
                .FindAllByCondition(x => x.AccountId == studentId && x.LecturesId == lectureId, false)
                .FirstOrDefault();

            return _mapper.Map<StudentProgressDTO>(entity);
        }

        public StudentProgressDTO CreateStudentProgress(StudentProgressCreateDTO dto)
        {
            var entity = _mapper.Map<StudentProgress>(dto); 

            _manager.StudentProgress.Create(entity);
            _manager.Save();

            return _mapper.Map<StudentProgressDTO>(entity);
        }
        public bool IsLessonCompleted(int studentId, int lessonId)
        {
            var isCompleted = _manager.StudentProgress
                .FindAllByCondition(x => x.AccountId == studentId && x.LecturesId == lessonId && x.LecturesCompleted == true, false)
                .Any();
            return isCompleted;
        }
        public void MarkLessonAsCompleted(int studentId, int lessonId)
        {
            if (IsLessonCompleted(studentId, lessonId))
                return;

            var progress = _manager.StudentProgress
                .FindAllByCondition(x => x.AccountId == studentId && x.LecturesId == lessonId, false)
                .FirstOrDefault();
            if (progress != null)
                {
                progress.LecturesCompleted = true;
                progress.ProgressPerc = 100;
                progress.LastUpdate = BitConverter.GetBytes(DateTime.UtcNow.Ticks);
                _manager.StudentProgress.Update(progress);
                _manager.Save();
            }

        }

        public StudentProgressDTO UpdateStudentProgress(StudentProgressUpdateDTO dto,int id)
        {
            var entity = _mapper.Map<StudentProgress>(dto);

            _manager.StudentProgress.Update(entity);
            _manager.Save();

            return _mapper.Map<StudentProgressDTO>(entity);
        }
    }
}
