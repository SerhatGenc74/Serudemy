import React from 'react';

const LessonFormFields = ({ formData, onFormChange }) => {
    return (
        <>
            <div className="form-group">
                <label className="form-label" htmlFor="name">📚 Ders Adı *</label>
                <input
                    className="form-input"
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onFormChange}
                    placeholder="Dersin adını girin"
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="videoDesc">📝 Ders Açıklaması</label>
                <textarea
                    className="form-textarea"
                    id="videoDesc"
                    name="videoDesc"
                    value={formData.videoDesc}
                    onChange={onFormChange}
                    placeholder="Ders hakkında kısa bir açıklama yazın"
                    rows="4"
                />
            </div>
        </>
    );
};

export default LessonFormFields;