import React from 'react';

const LessonsError = ({ error }) => {
    return (
        <div className="lessons-container">
            <div className="error-container">
                <div className="error-text">❌ Hata: {error?.message || 'Bilinmeyen hata'}</div>
            </div>
        </div>
    );
};

export default LessonsError;