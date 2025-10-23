import React from 'react';

const LessonsLoading = () => {
    return (
        <div className="lessons-container">
            <div className="loading-container">
                <div className="loading-spinner">🔄</div>
                <div className="loading-text">Dersler yükleniyor...</div>
            </div>
        </div>
    );
};

export default LessonsLoading;