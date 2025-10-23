import React from 'react';
import useCourseProgress from './CourseProgress';
import CompletedLessonsCount from './CompletedLessonsCount';

const CourseProgressInfo = ({ studentId, courseId }) => {
    const progressData = useCourseProgress(studentId, courseId);

    if (progressData.loading) {
        return (
            <div className="course-progress-section">
                <div className="progress-info">
                    <span className="progress-label">İlerleme</span>
                    <span className="progress-percentage">--%</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{width: '0%'}}></div>
                </div>
                <div className="progress-details">
                    <span>Yükleniyor...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="course-progress-section">
            <div className="progress-info">
                <span className="progress-label">İlerleme</span>
                <span className="progress-percentage">{progressData.display}</span>
            </div>
            <div className="progress-bar">
                <div 
                    className="progress-fill" 
                    style={{width: `${progressData.percentage}%`}}
                ></div>
            </div>
            <div className="progress-details">
                <span>
                    <CompletedLessonsCount studentId={studentId} courseId={courseId} />
                </span>
            </div>
        </div>
    );
};

export default CourseProgressInfo;