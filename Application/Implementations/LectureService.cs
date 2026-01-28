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
    public class LectureService : ILectureService
    {
        IRepositoryManager _manager;
        IMapper _mapper;
        public LectureService(IRepositoryManager manager,IMapper mapper)
        {
            _mapper = mapper;
            _manager = manager;
        }

        public LectureDTO CreateLecture(LectureCreateDTO dto)
        {
            var entity = _mapper.Map<Lecture>(dto);

            _manager.Lecture.Create(entity);
            _manager.Save();

            return _mapper.Map<LectureDTO>(entity);
        }

        public bool DeleteLecture(int lectureId)
        {
            return true;
        }

        public IQueryable<LectureDTO> GetAllLectures()
        {
            var entity = _manager.Lecture
                .FindAll(false)
                .Include(l => l.Courses)
                .Include(l => l.StudentProgresses);

            return _mapper.ProjectTo<LectureDTO>(entity);
        }

        public IQueryable<LectureDTO> GetAllLectures(int courseId)
        {
            var entity = _manager.Lecture
                .FindAllByCondition(x => x.CoursesId == courseId, false)
                .Include(l => l.Courses)
                .Include(l => l.StudentProgresses);

            return _mapper.ProjectTo<LectureDTO>(entity);
        }

        //Spesifed course ile ilgili lectureları getirir
        public IQueryable<LectureDTO> GetAllLecturesWithCourse(int courseId)
        {
            var entity = _manager.Lecture
                .FindAllByCondition(x => x.CoursesId == courseId, true)
                .Include(c => c.Courses)
                .Include(l => l.StudentProgresses);

            return _mapper.ProjectTo<LectureDTO>(entity);
        }

        public LectureDTO GetFirstLecture(int courseId)
        {
            var entity = _manager.Lecture
                .FindAllByCondition(x => x.CoursesId == courseId && x.LectureOrder == 1, false)
                .Include(l => l.Courses)
                .Include(l => l.StudentProgresses)
                .FirstOrDefault();

            return _mapper.Map<LectureDTO>(entity);
        }

        public LectureDTO GetLecture(int lectureId)
        {
            // NOT: Bu metod tüm dersleri döndürür (öğretmen/admin için)
            // Öğrenciler için GetLecturesForStudent kullanılmalı
            var entity = _manager.Lecture
                .FindAllByCondition(x => x.Id == lectureId, false)
                .Include(l => l.Courses)
                .Include(l => l.StudentProgresses)
                .FirstOrDefault();

            return _mapper.Map<LectureDTO>(entity);
        }

        public double GetTotalLessonCount(int courseId)
        {
            double count = _manager.Lecture.FindAllByCondition(x => x.CoursesId == courseId, false).Count();
            return count;   
        }

        public bool ReorderLecture(int lectureId, int newOrder)
        {
            var lecture = _manager.Lecture.FindByCondition(x => x.Id == lectureId, false);
            if (lecture == null)
                return false;

            if (lecture.CoursesId == null)
                return false;

            var courseId = lecture.CoursesId.Value;

            var lectures = _manager.Lecture
                .FindAllByCondition(l => l.CoursesId == courseId, false)
                .OrderBy(l => l.LectureOrder ?? int.MaxValue)
                .ThenBy(l => l.Id)
                .ToList();

            if (lectures.Count == 0)
                return false;

            // Remove the lecture being moved and re-insert at the requested position
            lectures.RemoveAll(l => l.Id == lectureId);
            var clampedOrder = Math.Max(1, Math.Min(newOrder, lectures.Count + 1));
            lectures.Insert(clampedOrder - 1, lecture);

            // Renumber sequentially to keep a consistent ordering
            for (var i = 0; i < lectures.Count; i++)
            {
                var l = lectures[i];
                var desiredOrder = i + 1;
                if (l.LectureOrder != desiredOrder)
                {
                    l.LectureOrder = desiredOrder;
                    l.UpdatedAt = DateTime.Now;
                    _manager.Lecture.Update(l);
                }
            }

            _manager.Save();
            return true;
        }

        public LectureDTO UpdateLecture(LectureUpdateDTO dto,int lectureId)
        {
            var entity = _manager.Lecture.FindByCondition(x => x.Id == lectureId, false);
            if (entity == null)
                return null;

            _mapper.Map(dto, entity);
            _manager.Lecture.Update(entity);
            _manager.Save();

            return _mapper.Map<LectureDTO>(entity);
        }

        // Zamanlanmış ve yayınlanma zamanı gelmiş dersleri yayınla
        public int PublishScheduledLectures()
        {
            var now = DateTime.UtcNow;
            var scheduledLectures = _manager.Lecture
                .FindAllByCondition(l => !l.IsPublished && l.ScheduledPublishDate != null && l.ScheduledPublishDate <= now, true)
                .ToList();

            foreach (var lecture in scheduledLectures)
            {
                lecture.IsPublished = true;
                lecture.UpdatedAt = DateTime.Now;
                _manager.Lecture.Update(lecture);
            }

            if (scheduledLectures.Any())
            {
                _manager.Save();
            }

            return scheduledLectures.Count;
        }

        // Yayınlanmış dersleri getir (öğrenciler için)
        public IQueryable<LectureDTO> GetPublishedLectures(int courseId)
        {
            var entity = _manager.Lecture
                .FindAllByCondition(x => 
                    x.CoursesId == courseId && 
                    x.IsPublished && 
                    x.LectureAccessStatus == LectureAccessStatus.Published && 
                    x.IsAccessible == true, false)
                .Include(l => l.Courses)
                .Include(l => l.StudentProgresses);

            return _mapper.ProjectTo<LectureDTO>(entity);
        }

        // Tüm dersleri getir (öğretmenler için - zamanlanmış dahil)
        public IQueryable<LectureDTO> GetAllLecturesForInstructor(int courseId)
        {
            var entity = _manager.Lecture
                .FindAllByCondition(x => x.CoursesId == courseId, false)
                .Include(l => l.Courses)
                .Include(l => l.StudentProgresses);

            return _mapper.ProjectTo<LectureDTO>(entity);
        }

        // Zamanlanmış (henüz yayınlanmamış) dersleri getir
        public IQueryable<LectureDTO> GetScheduledLectures(int courseId)
        {
            var entity = _manager.Lecture
                .FindAllByCondition(x => x.CoursesId == courseId && !x.IsPublished && x.ScheduledPublishDate != null, false)
                .Include(l => l.Courses)
                .Include(l => l.StudentProgresses);

            return _mapper.ProjectTo<LectureDTO>(entity);
        }

        // Öğrenciler için dersleri getir (yayınlanmış + zamanlanmış, taslaklar hariç)
        public IQueryable<LectureDTO> GetLecturesForStudent(int courseId)
        {
            var entity = _manager.Lecture
                .FindAllByCondition(x => 
                    x.CoursesId == courseId && 
                    x.LectureAccessStatus == LectureAccessStatus.Published && 
                    x.IsAccessible == true && 
                    (x.IsPublished || x.ScheduledPublishDate != null), false)
                .Include(l => l.Courses)
                .Include(l => l.StudentProgresses);

            return _mapper.ProjectTo<LectureDTO>(entity);
        }

        // Öğrenciler için tek bir dersi güvenli şekilde getir
        public LectureDTO GetLectureForStudent(int lectureId, int courseId)
        {
            var entity = _manager.Lecture
                .FindAllByCondition(x => 
                    x.Id == lectureId && 
                    x.CoursesId == courseId &&
                    x.LectureAccessStatus == LectureAccessStatus.Published && 
                    x.IsAccessible == true, false)
                .Include(l => l.Courses)
                .Include(l => l.StudentProgresses)
                .FirstOrDefault();

            return _mapper.Map<LectureDTO>(entity);
        }

        // Lecture status management (Taslak/Yayınlanma/Arşiv)
        public LectureDTO PublishLecture(int lectureId)
        {
            var lecture = _manager.Lecture.FindByCondition(x => x.Id == lectureId, false);
            if (lecture == null)
                throw new ArgumentException($"Lecture with id {lectureId} not found");

            lecture.LectureAccessStatus = LectureAccessStatus.Published;
            lecture.UpdatedAt = DateTime.Now;
            _manager.Lecture.Update(lecture);
            _manager.Save();

            return _mapper.Map<LectureDTO>(lecture);
        }

        public LectureDTO UnpublishLecture(int lectureId)
        {
            var lecture = _manager.Lecture.FindByCondition(x => x.Id == lectureId, false);
            if (lecture == null)
                throw new ArgumentException($"Lecture with id {lectureId} not found");

            lecture.LectureAccessStatus = LectureAccessStatus.Draft;
            lecture.UpdatedAt = DateTime.Now;
            _manager.Lecture.Update(lecture);
            _manager.Save();

            return _mapper.Map<LectureDTO>(lecture);
        }

        public LectureDTO ArchiveLecture(int lectureId)
        {
            var lecture = _manager.Lecture.FindByCondition(x => x.Id == lectureId, false);
            if (lecture == null)
                throw new ArgumentException($"Lecture with id {lectureId} not found");

            lecture.LectureAccessStatus = LectureAccessStatus.Archived;
            lecture.UpdatedAt = DateTime.Now;
            _manager.Lecture.Update(lecture);
            _manager.Save();

            return _mapper.Map<LectureDTO>(lecture);
        }

        public LectureDTO SetLectureAccessibility(int lectureId, bool isAccessible)
        {
            var lecture = _manager.Lecture.FindByCondition(x => x.Id == lectureId, false);
            if (lecture == null)
                throw new ArgumentException($"Lecture with id {lectureId} not found");

            lecture.IsAccessible = isAccessible;
            lecture.UpdatedAt = DateTime.Now;
            _manager.Lecture.Update(lecture);
            _manager.Save();

            return _mapper.Map<LectureDTO>(lecture);
        }

        public IQueryable<LectureDTO> GetPublishedLecturesByStatus(int courseId)
        {
            var entity = _manager.Lecture
                .FindAllByCondition(x => x.CoursesId == courseId && x.LectureAccessStatus == LectureAccessStatus.Published, false)
                .Include(l => l.Courses)
                .Include(l => l.StudentProgresses);

            return _mapper.ProjectTo<LectureDTO>(entity);
        }

        public IQueryable<LectureDTO> GetAccessibleLectures(int courseId)
        {
            var entity = _manager.Lecture
                .FindAllByCondition(x => x.CoursesId == courseId && x.IsAccessible, false)
                .Include(l => l.Courses)
                .Include(l => l.StudentProgresses);

            return _mapper.ProjectTo<LectureDTO>(entity);
        }
    }
}
