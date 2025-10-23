import React from 'react';
import { Link } from 'react-router-dom';
import CourseProgressInfo from './CourseProgressInfo';
import LectureCount from './LectureCount';

const CourseCard = ({ course, filter, accountId }) => {
    const truncateDescription = (description, maxLength = 120) => {
        if (!description) return '';
        return description.length > maxLength 
            ? `${description.substring(0, maxLength)}...`
            : description;
    };

    const renderBadges = () => {
        if (filter === 'my-courses') {
            return <span className="enrolled-badge">✅ Kayıtlı</span>;
        }

        return (
            <>
                <span className={`status-badge ${course.courseAccessStatus?.toLowerCase()}`}>
                    {course.courseAccessStatus === 'Published' && '✅ Yayında'}
                    {course.courseAccessStatus === 'Draft' && '📝 Taslak'}
                    {course.courseAccessStatus === 'Archived' && '📦 Arşiv'}
                </span>
                {course.isAccessible && (
                    <span className="access-badge accessible">🔓 Erişilebilir</span>
                )}
            </>
        );
    };

    const renderActions = () => {
        if (filter === 'my-courses') {
            return (
                <>
                    <Link 
                        to={`/courses/${course.courseId}`}
                        className="course-btn primary"
                    >
                        ▶️ Devam Et
                    </Link>
                    <Link 
                        to={`/courses/${course.courseId}`}
                        className="course-btn secondary"
                    >
                        📋 Dersler
                    </Link>
                </>
            );
        }

        return (
            <Link 
                to={`/courses/${course.courseId}`}
                className="course-btn primary"
            >
                📖 Detayları Gör
            </Link>
        );
    };

    return (
        <div className={`course-card ${filter === 'my-courses' ? 'enrolled-course' : ''}`}>
            <div className="course-image">
                {course.image ? (
                    <img src={course.image} alt={course.name} />
                ) : (
                    <div className="placeholder-image">📖</div>
                )}
                <div className="course-badges">
                    {renderBadges()}
                </div>
            </div>

            <div className="course-content">
                <h3 className="course-title">{course.name}</h3>
                <p className="course-description">
                    {truncateDescription(course.description)}
                </p>

                <div className="course-meta">
                    <div className="course-instructor">
                        <span className="instructor-icon">👨‍🏫</span>
                        <span className="instructor-name">
                            {course.courseOwner?.name || 'Eğitmen'}
                        </span>
                    </div>

                    {filter === 'my-courses' && (
                        <CourseProgressInfo 
                            studentId={accountId} 
                            courseId={course.courseId} 
                        />
                    )}

                    <div className="course-info">
                        <div className="info-item">
                            <span className="info-icon">🎯</span>
                            <span className="info-text">
                                {course.targetGradeLevel || 'Tüm seviyeler'}. Sınıf
                            </span>
                        </div>
                        
                        {course.targetDepartment && (
                            <div className="info-item">
                                <span className="info-icon">🏫</span>
                                <span className="info-text">
                                    {course.targetDepartment.name}
                                </span>
                            </div>
                        )}

                        <div className="info-item">
                            <span className="info-icon">🎥</span>
                            <span className="info-text">
                                <LectureCount courseId={course.courseId} />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="course-actions">
                    {renderActions()}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;