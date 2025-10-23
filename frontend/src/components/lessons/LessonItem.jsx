import React from 'react';
import { Link } from 'react-router-dom';

const LessonItem = ({ lesson, courseId, onDelete }) => {
    return (
        <tr>
            <td className="lesson-id">#{lesson.id}</td>
            <td className="lesson-name">{lesson.name}</td>
            <td className="lesson-description">{lesson.description || lesson.videoDesc}</td>
            <td>
                <div className="action-buttons">
                    <Link to={`/course/${courseId}/lecture/${lesson.id}/edit`}>
                        <button className="btn btn-update">
                            ✏️ Düzenle
                        </button>
                    </Link>
                    <button 
                        className="btn btn-delete"
                        onClick={() => onDelete && onDelete(lesson.id)}
                    >
                        🗑️ Sil
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default LessonItem;