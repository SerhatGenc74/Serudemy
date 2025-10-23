import React from 'react';

const CoursesError = () => {
    return (
        <div className="courses-container">
            <div className="courses-error">
                <div className="error-icon">❌</div>
                <h2>Bir hata oluştu</h2>
                <p>Kurslar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
            </div>
        </div>
    );
};

export default CoursesError;