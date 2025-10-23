import React from 'react';

const CoursesHeader = ({ filter, enrolledCourses, courses }) => {
    const getTitle = () => {
        return filter === 'my-courses' ? '📖 Kurslarım' : '🔓 Erişilebilir Kurslar';
    };

    const getSubtitle = () => {
        if (filter === 'my-courses') {
            return `${enrolledCourses?.length || 0} kursa kayıtlısınız`;
        } else {
            return `${courses?.filter(c => c.isAccessible)?.length || 0} erişilebilir kurs bulundu`;
        }
    };

    return (
        <div className="courses-header">
            <div className="header-content">
                <h1 className="page-title">{getTitle()}</h1>
                <p className="page-subtitle">{getSubtitle()}</p>
            </div>
        </div>
    );
};

export default CoursesHeader;