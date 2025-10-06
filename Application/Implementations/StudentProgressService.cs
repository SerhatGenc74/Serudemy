using Application.Contracts;
using AutoMapper;
using Contracts.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Implementations
{
    public class StudentProgressService : IStudentProgressService
    {
        private readonly IRepositoryManager _manager;
        private readonly IMapper _mapper;
        
        public StudentProgressService(IMapper mapper, IRepositoryManager manager)
        {
            _mapper = mapper;
            _manager = manager;
        }

        public IQueryable<StudentProgressDTO> GetAllStudentProgress()
        {
            var entities = _manager.StudentProgress.FindAll(false);
            return _mapper.ProjectTo<StudentProgressDTO>(entities);
        }

        public StudentProgressDTO GetStudentProgressById(int id)
        {
            var entity = _manager.StudentProgress.FindByCondition(sp => sp.Id == id, false);
            return _mapper.Map<StudentProgressDTO>(entity);
        }

        public StudentProgressDTO GetStudentProgress(int studentId, int lectureId)
        {
            var entity = _manager.StudentProgress
                .FindAllByCondition(x => x.AccountId == studentId && x.LecturesId == lectureId, false)
                .FirstOrDefault();

            return _mapper.Map<StudentProgressDTO>(entity);
        }

        public IQueryable<StudentProgressDTO> GetAllStudentProgressWithLecture()
        {
            var entities = _manager.StudentProgress.FindAll(false).Include(c => c.Lectures);
            return _mapper.ProjectTo<StudentProgressDTO>(entities);
        }

        public IQueryable<StudentProgressDTO> GetCompletedLessons(int studentId, int courseId)
        {
            var entities = _manager.StudentProgress
                .FindAllByCondition(x => x.AccountId == studentId && x.Lectures!.CoursesId == courseId && x.LecturesCompleted == true, false);

            return _mapper.ProjectTo<StudentProgressDTO>(entities);
        }

        public IQueryable<StudentProgressDTO> GetStudentProgressByStudentId(int studentId)
        {
            var entities = _manager.StudentProgress.FindAllByCondition(sp => sp.AccountId == studentId, false);
            return _mapper.ProjectTo<StudentProgressDTO>(entities);
        }

        public IQueryable<StudentProgressDTO> GetStudentProgressByLectureId(int lectureId)
        {
            var entities = _manager.StudentProgress.FindAllByCondition(sp => sp.LecturesId == lectureId, false);
            return _mapper.ProjectTo<StudentProgressDTO>(entities);
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


        public int GetCompletedLessonCount(int studentId, int courseId)
        {
            var count = _manager.StudentProgress
                .FindAllByCondition(x => x.AccountId == studentId && x.Lectures!.CoursesId == courseId && x.LecturesCompleted == true, false)
                .Count();
            return count;
        }

        public double GetProgressPercentage(int studentId, int courseId)
        {
            ILectureService service = new LectureService(_manager, _mapper);

            double totalLectures = service.GetTotalLessonCount(courseId);
            if (totalLectures == 0) return 0;
            double completedLectures = GetCompletedLessonCount(studentId, courseId);

            return completedLectures / totalLectures * 100;
        }
        public void UpdatePlaybackPosition(int studentId, int lectureId, int position)
        {
            var progress = _manager.StudentProgress
                .FindAllByCondition(x => x.AccountId == studentId && x.LecturesId == lectureId, false)
                .FirstOrDefault();

            if (progress != null)
            {
                progress.PlaybackPosition = position;
                _manager.StudentProgress.Update(progress);
                _manager.Save();
            }
        }
        public int GetPlaybackPosition(int studentId, int lectureId)
        {
            var playbackPosition = _manager.StudentProgress
                .FindAllByCondition(x => x.AccountId == studentId && x.LecturesId == lectureId, false)
                .Select(x => x.PlaybackPosition)
                .FirstOrDefault();
            return playbackPosition ?? 0;
        }

        public StudentProgressDTO CreateStudentProgress(StudentProgressCreateDTO dto)
        {
            var entity = _mapper.Map<StudentProgress>(dto);

            _manager.StudentProgress.Create(entity);
            _manager.Save();

            return _mapper.Map<StudentProgressDTO>(entity);
        }

        public StudentProgressDTO UpdateStudentProgress(StudentProgressUpdateDTO dto, int id)
        {
            var entity = _manager.StudentProgress.FindByCondition(sp => sp.Id == id, false);
            if (entity == null)
                return null;

            _mapper.Map(dto, entity);
            _manager.StudentProgress.Update(entity);
            _manager.Save();

            return _mapper.Map<StudentProgressDTO>(entity);
        }

        public void DeleteStudentProgress(int id)
        {
            var entity = _manager.StudentProgress.FindByCondition(sp => sp.Id == id, false);
            if (entity != null)
            {
                _manager.StudentProgress.Delete(entity);
                _manager.Save();
            }
        }

        public StudentProgressDTO GetLastProgressWithLecture(int accountId, int courseId)
        {
            var entity = _manager.StudentProgress
                .FindAllByCondition(sp => sp.AccountId == accountId && sp.Lectures!.CoursesId == courseId, false)
                .Include(sp => sp.Lectures)
                .OrderByDescending(c => c.LastUpdate)
                .FirstOrDefault();

            return _mapper.Map<StudentProgressDTO>(entity);
        }
         public IQueryable<StudentProgressDTO> GetStudentProgressInCourse(int studentId, int courseId)
        {
            var entities = _manager.StudentProgress
                .FindAllByCondition(sp => sp.AccountId == studentId && sp.Lectures.CoursesId == courseId, false)
                .Include(sp => sp.Lectures)
                .Include(sp => sp.Account);

            return _mapper.ProjectTo<StudentProgressDTO>(entities);
        }

        private bool IsLessonCompleted(int studentId, int lessonId)
        {
            var isCompleted = _manager.StudentProgress
                .FindAllByCondition(x => x.AccountId == studentId && x.LecturesId == lessonId && x.LecturesCompleted == true, false)
                .Any();
            return isCompleted;
        }
    }
}
