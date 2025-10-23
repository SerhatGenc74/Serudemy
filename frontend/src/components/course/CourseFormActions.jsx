import { Link } from 'react-router-dom';

const CourseFormActions = ({ onSubmit, isSubmitting, submitMessage, cancelPath = "/instructor/dashboard" }) => {
    return (
        <div className="form-actions">
            {submitMessage && (
                <div className={`message ${submitMessage.includes('başarı') ? 'success' : 'error'}`}>
                    {submitMessage}
                </div>
            )}
            
            <div className="action-buttons">
                <Link to={cancelPath} className="btn btn-secondary">
                    İptal
                </Link>
                <button 
                    type="submit" 
                    onClick={onSubmit}
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>
        </div>
    );
};

export default CourseFormActions;