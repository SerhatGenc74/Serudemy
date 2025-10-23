import React from 'react';

const LessonFormActions = ({ 
    isSubmitting, 
    submitMessage, 
    onSubmit, 
    onCancel,
    isEdit = false 
}) => {
    return (
        <div className="form-actions">
            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-submit"
                onClick={onSubmit}
            >
                {isSubmitting ? (
                    <>🔄 {isEdit ? 'Güncelleniyor...' : 'Oluşturuluyor...'}</>
                ) : (
                    <>{isEdit ? '✅ Dersi Güncelle' : '✅ Dersi Oluştur'}</>
                )}
            </button>
            
            <button
                type="button"
                onClick={onCancel}
                className="btn-cancel"
                disabled={isSubmitting}
            >
                ❌ İptal
            </button>

            {submitMessage && (
                <div className={`submit-message ${submitMessage.includes('başarıyla') ? 'success' : 'error'}`}>
                    {submitMessage}
                </div>
            )}
        </div>
    );
};

export default LessonFormActions;