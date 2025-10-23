import React from 'react';
import { Link } from 'react-router-dom';

const LectureNavigation = ({ 
    allLectures, 
    currentLectureIndex, 
    courseId, 
    lecturesCompleted,
    onMarkComplete,
    onMarkIncomplete 
}) => {
    const prevLecture = currentLectureIndex > 0 ? allLectures[currentLectureIndex - 1] : null;
    const nextLecture = currentLectureIndex < allLectures.length - 1 ? allLectures[currentLectureIndex + 1] : null;

    return (
        <div className="lecture-navigation">
            <div className="navigation-buttons">
                {prevLecture && (
                    <Link 
                        to={`/course/${courseId}/lecture/${prevLecture.id}`}
                        className="nav-btn prev-btn"
                    >
                        ← Önceki Ders: {prevLecture.name}
                    </Link>
                )}
                
                {nextLecture && (
                    <Link 
                        to={`/course/${courseId}/lecture/${nextLecture.id}`}
                        className="nav-btn next-btn"
                    >
                        Sonraki Ders: {nextLecture.name} →
                    </Link>
                )}
            </div>
            
            <div className="completion-controls">
                {lecturesCompleted ? (
                    <button 
                        className="btn-mark-incomplete"
                        onClick={onMarkIncomplete}
                    >
                        ❌ Tamamlanmamış Olarak İşaretle
                    </button>
                ) : (
                    <button 
                        className="btn-mark-complete"
                        onClick={onMarkComplete}
                    >
                        ✅ Tamamlandı Olarak İşaretle
                    </button>
                )}
            </div>
        </div>
    );
};

export default LectureNavigation;