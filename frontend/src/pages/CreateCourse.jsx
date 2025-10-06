import useFetch from '../hooks/useFetch';
import { useState } from 'react';
import '../styles/CreateCourse.css';

const CreateCourse = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [departmentId, setDepartmentId] = useState("");
    const [classLevel, setClassLevel] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage("");

        try {
            if (!randomnumber) {
                throw new Error("Random number not loaded yet.");
            }

            if (!title.trim()) {
                throw new Error("Kurs başlığı gereklidir.");
            }

            if (!description.trim()) {
                throw new Error("Kurs açıklaması gereklidir.");
            }

            if (!departmentId) {
                throw new Error("Bölüm seçimi gereklidir.");
            }

            if (!classLevel) {
                throw new Error("Sınıf seviyesi seçimi gereklidir.");
            }

            const formData = new FormData();
            formData.append('courseId', randomnumber);
            formData.append('courseOwnerId', 9002);
            formData.append('name', title);
            formData.append('description', description);
            formData.append('targetDepartmentId', departmentId);
            formData.append('targetGradeLevel', classLevel);
            formData.append('updatedAt', new Date().toISOString());
            formData.append('createdAt', new Date().toISOString());
            if (image) {
                formData.append('image', image);
            }

            const response = await fetch('http://localhost:5225/api/course/create', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                setSubmitMessage("✅ Kurs başarıyla oluşturuldu!");
                // Form alanlarını temizle
                setTitle("");
                setDescription("");
                setImage(null);
                setDepartmentId("");
                setClassLevel("");
            } else {
                throw new Error("Kurs oluşturulurken bir hata oluştu.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitMessage(`❌ Hata: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const {data:departments,loading,error} = useFetch('http://localhost:5225/api/department');
    const {data : randomnumber} = useFetch('http://localhost:5225/api/course/random');
    

    
    if(loading) return <div className="loading-spinner">🔄 Veriler yükleniyor...</div>;
    if(error) return <div className="error-message">❌ Hata: {error.message}</div>;

    return (
        <div className="create-course-container">
            <div className="create-course-card">
                <div className="create-course-header">
                    <h1 className="create-course-title">🎓 Yeni Kurs Oluştur</h1>
                    <p className="create-course-subtitle">Öğrencileriniz için yeni bir öğrenme deneyimi yaratın</p>
                </div>
                
                <div className="create-course-content">
                    <div className="form-section">
                        <h2 className="form-section-title">
                            📝 Kurs Bilgileri
                        </h2>
                        
                        {submitMessage && (
                            <div className={`${submitMessage.includes('✅') ? 'success-message' : 'error-message'}`}>
                                {submitMessage}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">
                                    📚 Kurs Başlığı
                                </label>
                                <input 
                                    type="text" 
                                    className="form-input"
                                    onChange={(e) => setTitle(e.target.value)} 
                                    placeholder="Örn: React ile Web Geliştirme" 
                                    value={title}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">
                                    📄 Kurs Açıklaması
                                </label>
                                <textarea 
                                    className="form-textarea"
                                    onChange={(e) => setDescription(e.target.value)} 
                                    placeholder="Kursunuz hakkında detaylı bilgi verin..."
                                    value={description}
                                    required
                                ></textarea>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">
                                    🖼️ Kurs Görseli
                                </label>
                                <div className="file-input-wrapper">
                                    <input 
                                        type="file" 
                                        className="file-input"
                                        accept="image/*"
                                        onChange={(e) => setImage(e.target.files[0])} 
                                    />
                                    <div className="file-input-label">
                                        <span className="file-input-icon">📁</span>
                                        <div>
                                            <div>{image ? image.name : "Görsel seçin"}</div>
                                            <small style={{opacity: 0.7}}>PNG, JPG veya JPEG formatında</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">
                                    🏫 Bölüm
                                </label>
                                <select 
                                    className="form-select"
                                    onChange={(e) => setDepartmentId(e.target.value)}
                                    value={departmentId}
                                    required
                                >
                                    <option value="">Bölüm seçiniz...</option>
                                    {departments && departments.map(department => (
                                        <option key={department.id} value={department.id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">
                                    🎯 Sınıf Seviyesi
                                </label>
                                <select 
                                    className="form-select"
                                    onChange={(e) => setClassLevel(e.target.value)}
                                    value={classLevel}
                                    required
                                >
                                    <option value="">Sınıf seviyesi seçiniz...</option>
                                    <option value="1">1. Sınıf</option>
                                    <option value="2">2. Sınıf</option>
                                    <option value="3">3. Sınıf</option>
                                    <option value="4">4. Sınıf</option>
                                </select>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "🔄 Oluşturuluyor..." : "💾 Kursu Oluştur"}
                            </button>
                        </form>
                    </div>
                    
                    <div className="preview-section">
                        <h3 className="preview-title">
                            👁️ Önizleme
                        </h3>
                        
                        <div className="preview-item">
                            <div className="preview-label">Kurs Başlığı:</div>
                            <div className={`preview-value ${!title ? 'empty' : ''}`}>
                                {title || "Henüz girilmedi"}
                            </div>
                        </div>
                        
                        <div className="preview-item">
                            <div className="preview-label">Açıklama:</div>
                            <div className={`preview-value ${!description ? 'empty' : ''}`}>
                                {description || "Henüz girilmedi"}
                            </div>
                        </div>
                        
                        <div className="preview-item">
                            <div className="preview-label">Bölüm:</div>
                            <div className={`preview-value ${!departmentId ? 'empty' : ''}`}>
                                {departments?.find(d => d.id == departmentId)?.name || "Seçilmedi"}
                            </div>
                        </div>
                        
                        <div className="preview-item">
                            <div className="preview-label">Sınıf Seviyesi:</div>
                            <div className={`preview-value ${!classLevel ? 'empty' : ''}`}>
                                {classLevel ? `${classLevel}. Sınıf` : "Seçilmedi"}
                            </div>
                        </div>
                        
                        <div className="image-preview">
                            {image ? (
                                <img 
                                    src={URL.createObjectURL(image)} 
                                    alt="Kurs Görseli" 
                                    className="preview-image"
                                />
                            ) : (
                                <div className="no-image-placeholder">
                                    🖼️<br />
                                    Görsel seçilmedi
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CreateCourse;