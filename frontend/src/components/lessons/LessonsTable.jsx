import React from 'react';
import LessonItem from './LessonItem';

const LessonsTable = ({ lessons, courseId, onDeleteLesson }) => {
    if (!lessons || lessons.length === 0) {
        return (
            <div className="lessons-table-container">
                <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <div className="empty-state-title">Henüz ders bulunmuyor</div>
                    <div className="empty-state-description">
                        Bu kursa henüz ders eklenmemiş. İlk dersi eklemek için yeni ders oluştur butonuna tıklayın.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="lessons-table-container">
            <table className="lessons-table">
                <thead>
                    <tr>
                        <th>🆔 Ders ID</th>
                        <th>📖 Ders Adı</th>
                        <th>📝 Açıklama</th>
                        <th>⚙️ İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {lessons.map((lesson, index) => (
                        <LessonItem 
                            key={lesson.id || index}
                            lesson={lesson}
                            courseId={courseId}
                            onDelete={onDeleteLesson}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LessonsTable;