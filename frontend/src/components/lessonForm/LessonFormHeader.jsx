import React from 'react';

const LessonFormHeader = ({ isEdit = false, courseId }) => {
    return (
        <div className="lesson-create-header">
            <h1 className="lesson-create-title">
                {isEdit ? '✏️ Ders Düzenle' : '➕ Yeni Ders Oluştur'}
            </h1>
            <p className="lesson-create-subtitle">
                {isEdit 
                    ? 'Mevcut dersi güncelleyin ve değişiklikleri kaydedin' 
                    : 'Kursunuza yeni bir ders ekleyin'
                }
            </p>
            <div className="course-info">
                <span className="course-id">📚 Kurs ID: {courseId}</span>
            </div>
        </div>
    );
};

export default LessonFormHeader;