import React from 'react';
import { useNavigate } from 'react-router-dom';

const LessonsHeader = ({ courseId }) => {
    const navigate = useNavigate();

    return (
        <div className="lessons-content">
            <button 
                className="back-button"
                onClick={() => navigate('/instructor/dashboard')}
                title="Instructor Dashboard'a dön"
            >
                ← Geri Dön
            </button>
            
            <div className="lessons-header">
                <h1 className="lessons-title">📚 Kurs Dersleri</h1>
                <p className="lessons-subtitle">Kursunuza ait tüm dersleri görüntüleyin ve yönetin</p>
            </div>
            
            <div className="add-lesson-container">
                <button 
                    className="btn-add-lesson"
                    onClick={() => {
                        navigate(`/course/${courseId}/add-lesson`);
                    }}
                >
                    ➕ Yeni Ders Ekle
                </button>
            </div>
        </div>
    );
};

export default LessonsHeader;