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
                .FindAll(false)
                .Include(sp => sp.Lectures)
                .Where(x => x.AccountId == studentId && x.Lectures != null && x.Lectures.CoursesId == courseId && x.LecturesCompleted == true);

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
                .FindAll(false)
                .Include(sp => sp.Lectures)
                .Where(x => x.AccountId == studentId && x.Lectures != null && x.Lectures.CoursesId == courseId && x.LecturesCompleted == true)
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
            
            // LastUpdate otomatik ayarlanır (IsRowVersion) - Manuel set etmeye gerek yok

            _manager.StudentProgress.Create(entity);
            _manager.Save();

            return _mapper.Map<StudentProgressDTO>(entity);
        }

        public StudentProgressDTO UpdateStudentProgress(StudentProgressUpdateDTO dto, int id)
        {
            // trackChanges: true - EF entity'yi izlesin ki update çalışsın
            var entity = _manager.StudentProgress.FindByCondition(sp => sp.Id == id, trackChanges: true);
            if (entity == null)
                return null;

            // Tüm alanları güncelle ve force update için farklı değer ata sonra doğrusunu ata
            var originalCompleted = entity.LecturesCompleted;
            entity.LecturesCompleted = !dto.LecturesCompleted; // Önce tersini ata
            entity.LecturesCompleted = dto.LecturesCompleted;  // Sonra doğrusunu ata
            
            entity.AccountId = dto.AccountId;
            entity.LecturesId = dto.LecturesId;
            entity.ProgressPerc = dto.ProgressPerc;
            entity.WatchedSeconds = dto.WatchedSeconds;
            entity.PlaybackPosition = dto.PlaybackPosition;
            
            
            _manager.Save();
            
;

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
                .FindAll(false)
                .Include(sp => sp.Lectures)
                .Where(sp => sp.AccountId == accountId && sp.Lectures != null && sp.Lectures.CoursesId == courseId)
                .OrderByDescending(c => c.Id)
                .FirstOrDefault();

            return _mapper.Map<StudentProgressDTO>(entity);
        }
         public IQueryable<StudentProgressDTO> GetStudentProgressInCourse(int studentId, int courseId)
        {
            var entities = _manager.StudentProgress
                .FindAll(false)
                .Include(sp => sp.Lectures)
                .Include(sp => sp.Account)
                .Where(sp => sp.AccountId == studentId && sp.Lectures != null && sp.Lectures.CoursesId == courseId);

            return _mapper.ProjectTo<StudentProgressDTO>(entities);
        }
        public StudentProgressDTO IsAlreadyHaveProgress(int studentId, int lectureId)
        {
            var entity = _manager.StudentProgress
                .FindAllByCondition(u=>u.AccountId == studentId && u.LecturesId == lectureId, false)
                .FirstOrDefault();

            return _mapper.Map<StudentProgressDTO>(entity);
        }

        public object GetCourseProgressOverview(int courseId)
        {
            // Get all students enrolled in this course
            var enrolledStudents = _manager.StudentCourse
                .FindAllByCondition(sc => sc.CourseId == courseId, false)
                .Include(sc => sc.Account)
                .ToList();

            // Get total lecture count for this course
            var totalLectures = _manager.Lecture
                .FindAllByCondition(l => l.CoursesId == courseId, false)
                .Count();

            // Get all progress records for this course - Include first, then filter
            var allProgress = _manager.StudentProgress
                .FindAll(false)
                .Include(sp => sp.Account)
                .Include(sp => sp.Lectures)
                .Where(sp => sp.Lectures != null && sp.Lectures.CoursesId == courseId)
                .ToList();

            var studentProgressList = enrolledStudents.Select(sc => {
                var studentProgress = allProgress.Where(p => p.AccountId == sc.AccountId).ToList();
                var completedLectures = studentProgress.Count(p => p.LecturesCompleted == true);
                var progressPercentage = totalLectures > 0 ? (double)completedLectures / totalLectures * 100 : 0;
                var totalWatchedSeconds = studentProgress.Sum(p => p.WatchedSeconds ?? 0);
                
                // Get last activity by using Id (which correlates with creation order) instead of LastUpdate byte array
                var lastProgress = studentProgress.OrderByDescending(p => p.Id).FirstOrDefault();

                return new {
                    StudentId = sc.AccountId,
                    StudentName = sc.Account?.Name,
                    StudentSurname = sc.Account?.Surname,
                    StudentNo = sc.Account?.Userno,
                    EnrolledAt = sc.EnrolledAt,
                    CourseCompleted = sc.CourseCompleted,
                    CompletedLectures = completedLectures,
                    TotalLectures = totalLectures,
                    ProgressPercentage = Math.Round(progressPercentage, 1),
                    TotalWatchedSeconds = totalWatchedSeconds,
                    LastActivity = lastProgress?.LastUpdate,
                    LectureProgress = studentProgress.Select(p => new {
                        LectureId = p.LecturesId,
                        LectureName = p.Lectures?.Name ?? p.Lectures?.VideoName,
                        LectureOrder = p.Lectures?.LectureOrder,
                        IsCompleted = p.LecturesCompleted ?? false,
                        ProgressPerc = p.ProgressPerc ?? 0,
                        WatchedSeconds = p.WatchedSeconds ?? 0,
                        PlaybackPosition = p.PlaybackPosition ?? 0
                    }).OrderBy(l => l.LectureOrder).ToList()
                };
            }).ToList();

            return new {
                CourseId = courseId,
                TotalLectures = totalLectures,
                TotalStudents = enrolledStudents.Count,
                AverageProgress = studentProgressList.Any() ? Math.Round(studentProgressList.Average(s => s.ProgressPercentage), 1) : 0,
                Students = studentProgressList
            };
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
