import React from 'react';
import { Link } from 'react-router-dom';

const LecturesList = ({ lectures, currentLectureId, courseId }) => {
    if (!lectures || lectures.length === 0) {
        return (
            <div className="lectures-sidebar">
                <h3>Kurs Dersleri</h3>
                <p>Bu kursta henüz ders bulunmuyor.</p>
            </div>
        );
    }

    return (
        <div className="lectures-sidebar">
            <h3>Kurs Dersleri ({lectures.length})</h3>
            <div className="lectures-list">
                {lectures.map((lecture, index) => (
                    <Link
                        key={lecture.id}
                        to={`/course/${courseId}/lecture/${lecture.id}`}
                        className={`lecture-item ${lecture.id == currentLectureId ? 'active' : ''}`}
                    >
                        <div className="lecture-number">{index + 1}</div>
                        <div className="lecture-content">
                            <div className="lecture-title">{lecture.name}</div>
                            {lecture.lectureDuration && (
                                <div className="lecture-duration">
                                    {Math.floor(lecture.lectureDuration / 60)}:{(lecture.lectureDuration % 60).toString().padStart(2, '0')}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default LecturesList;