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
            return true;
        }

        public LectureDTO UpdateLecture(LectureUpdateDTO dto,int lectureId)
        {
            var entity = _manager.Lecture.FindByCondition(x => x.Id == lectureId, false);
            if (entity == null)
                return null;

            _mapper.Map(dto, entity);
            _manager.Save();

            return _mapper.Map<LectureDTO>(entity);
        }
    }
}
