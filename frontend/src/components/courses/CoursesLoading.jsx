import React from 'react';

const CoursesLoading = () => {
    return (
        <div className="courses-container">
            <div className="courses-loading">
                <div className="loading-spinner"></div>
                <p>Kurslar yükleniyor...</p>
            </div>
        </div>
    );
};

export default CoursesLoading;