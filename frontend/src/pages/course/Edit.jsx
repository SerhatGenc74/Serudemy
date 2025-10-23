import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useCurrentAccountId from "../../hooks/useAccountId";
import '../../styles/CreateCourse.css'; // Aynı CSS'i kullanabiliriz

const EditCourse = () => {
    const params = useParams();
    const navigate = useNavigate();
    const accountId = useCurrentAccountId();
    const {data: course, loading, error} = useFetch(`http://localhost:5225/api/Course/${params.courseId}`);
    const {data: departments} = useFetch('http://localhost:5225/api/department');

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageUrl: "",
        targetDepartmentId: "",
        targetGradeLevel: "",
        courseAccessStatus: "",
        isAccessible: false
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    // Course data geldiğinde formData'yı güncelle
    useEffect(() => {
        if (course) {
            setFormData({
                name: course.name || "",
                description: course.description || "",
                imageUrl: course.imageUrl || "",
                targetDepartmentId: course.targetDepartmentId || "",
                targetGradeLevel: course.targetGradeLevel || "",
                courseAccessStatus: course.courseAccessStatus || "Draft",
                isAccessible: course.isAccessible || false
            });
        }
    }, [course]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // File size kontrolü (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
                return;
            }
            
            // File type kontrolü
            if (!file.type.startsWith('image/')) {
                alert('Lütfen geçerli bir resim dosyası seçin');
                return;
            }
            
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        
        try {
            let imageUrl = formData.imageUrl;
            
            // Yeni dosya seçilmişse güncelle
            if (selectedFile) {
                console.log('Dosya güncelleniyor:', selectedFile.name);
                const fileFormData = new FormData();
                fileFormData.append('file', selectedFile);
                
                // Existing file path query parameter olarak gönder
                const existingFilePath = formData.imageUrl || '';
                const updateUrl = `http://localhost:5225/api/file/update?existingFilePath=${encodeURIComponent(existingFilePath)}`;
                
                const fileResponse = await fetch(updateUrl, {
                    method: 'PUT',
                    body: fileFormData
                });
                
                if (fileResponse.ok) {
                    const fileResult = await fileResponse.json();
                    imageUrl = fileResult.filePath;
                    console.log('Dosya güncellendi:', fileResult);
                } else {
                    throw new Error('Dosya güncelleme başarısız');
                }
            }
            
            // Kursu güncelle
            const submitData = {
                courseId: course.courseId, // Include CourseId from the fetched course data
                name: formData.name,
                description: formData.description,
                imageUrl: imageUrl,
                targetDepartmentId: parseInt(formData.targetDepartmentId),
                targetGradeLevel: parseInt(formData.targetGradeLevel),
                courseAccessStatus: formData.courseAccessStatus,
                isAccessible: formData.isAccessible,
                updatedAt: new Date().toISOString()
            };
            
            console.log('Kurs güncelleme verisi:', submitData);

            const response = await fetch(`http://localhost:5225/api/Course/${course.courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            });
            
            if (response.ok) {
                setSubmitMessage('✅ Kurs başarıyla güncellendi!');
                setTimeout(() => {
                    navigate('/instructor/dashboard');
                }, 2000);
            } else {
                const errorData = await response.text();
                throw new Error(errorData || 'Kurs güncellenirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error updating course:', error);
            setSubmitMessage(`❌ Hata: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="create-course-container">
            <div className="loading-container">
                <div className="loading-spinner">🔄</div>
                <div className="loading-text">Kurs bilgileri yükleniyor...</div>
            </div>
        </div>
    );
    
    if (error || !course) return (
        <div className="create-course-container">
            <div className="error-container">
                <div className="error-text">❌ Hata: {error?.message || 'Kurs bulunamadı'}</div>
                <button 
                    className="btn btn-cancel"
                    onClick={() => navigate('/instructor/dashboard')}
                >
                    ← Dashboard'a Dön
                </button>
            </div>
        </div>
    );

    return (
        <div className="create-course-container">
            <div className="create-course-card">
                <div className="create-course-header">
                    <h1 className="create-course-title">✏️ Kurs Düzenle</h1>
                    <p className="create-course-subtitle">Kurs bilgilerini güncelleyin ve değişiklikleri kaydedin</p>
                </div>
                
                <div className="create-course-content">
                    <div className="form-section">
                        <h2 className="form-section-title">📝 Kurs Bilgileri</h2>
                        
                        {submitMessage && (
                            <div className={`${submitMessage.includes('✅') ? 'success-message' : 'error-message'}`}>
                                {submitMessage}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">📚 Kurs Başlığı</label>
                                <input 
                                    type="text" 
                                    className="form-input"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Örn: React ile Web Geliştirme" 
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">📄 Kurs Açıklaması</label>
                                <textarea 
                                    className="form-textarea"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Kursunuz hakkında detaylı bilgi verin..."
                                    required
                                ></textarea>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">🖼️ Kurs Görseli</label>
                                <div className="file-input-wrapper">
                                    <input 
                                        type="file" 
                                        className="file-input"
                                        accept="image/*"
                                        id="course-image-input"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="course-image-input" className="file-input-label">
                                        <span className="file-input-icon">📁</span>
                                        <div>
                                            <div>
                                                {selectedFile 
                                                    ? selectedFile.name 
                                                    : (formData.imageUrl 
                                                        ? "Mevcut görsel (değiştirmek için seçin)" 
                                                        : "Görsel seçin"
                                                    )
                                                }
                                            </div>
                                            <small style={{opacity: 0.7}}>PNG, JPG veya JPEG formatında</small>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">🏫 Bölüm</label>
                                <select 
                                    className="form-select"
                                    name="targetDepartmentId"
                                    value={formData.targetDepartmentId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Bölüm seçin</option>
                                    {departments && departments.map(department => (
                                        <option key={department.id} value={department.id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">🎯 Hedef Seviye</label>
                                <select 
                                    className="form-select"
                                    name="targetGradeLevel"
                                    value={formData.targetGradeLevel}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seviye seçin</option>
                                    <option value="1">1. Sınıf</option>
                                    <option value="2">2. Sınıf</option>
                                    <option value="3">3. Sınıf</option>
                                    <option value="4">4. Sınıf</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">📊 Kurs Durumu</label>
                                <select 
                                    className="form-select"
                                    name="courseAccessStatus"
                                    value={formData.courseAccessStatus}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Draft">📝 Taslak (Draft)</option>
                                    <option value="Published">🌐 Yayınlandı (Published)</option>
                                    <option value="Archived">📦 Arşivlendi (Archived)</option>
                                </select>
                                <small className="form-help-text">
                                    • <strong>Taslak:</strong> Sadece siz görebilirsiniz<br/>
                                    • <strong>Yayınlandı:</strong> Öğrenciler kursu görebilir<br/>
                                    • <strong>Arşivlendi:</strong> Artık aktif değil
                                </small>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="isAccessible"
                                        checked={formData.isAccessible}
                                        onChange={handleChange}
                                        className="form-checkbox"
                                    />
                                    <span className="checkbox-text">
                                        🔓 Kurs Erişilebilir
                                    </span>
                                </label>
                                <small className="form-help-text">
                                    Bu seçeneği işaretlediğinizde öğrenciler kursa kayıt olup içeriği görüntüleyebilir.
                                    İşaretli değilse kurs listede görünür ama erişilemez.
                                </small>
                            </div>
                            
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-cancel"
                                    onClick={() => navigate('/instructor/dashboard')}
                                    disabled={isSubmitting}
                                >
                                    ❌ İptal
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="loading-spinner">🔄</span>
                                            Güncelleniyor...
                                        </>
                                    ) : (
                                        <>✅ Kursu Güncelle</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="preview-section">
                        <h2 className="form-section-title">👁️ Ön İzleme</h2>
                        <div className="course-preview-card">
                            <div className="course-preview-image">
                                {(selectedFile || formData.imageUrl) ? (
                                    <img 
                                        src={selectedFile ? URL.createObjectURL(selectedFile) : `http://localhost:5225${formData.imageUrl}`}
                                        alt="Kurs görseli"
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '12px'
                                        }}
                                    />
                                ) : (
                                    <div className="placeholder-image">
                                        <span style={{fontSize: '48px', opacity: 0.5}}>🖼️</span>
                                        <p style={{margin: '10px 0 0 0', opacity: 0.7}}>Görsel yüklenmedi</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="course-preview-content">
                                <h3 className="course-preview-title">
                                    {formData.name || "Kurs başlığı..."}
                                </h3>
                                
                                <p className="course-preview-description">
                                    {formData.description || "Kurs açıklaması..."}
                                </p>
                                
                                <div className="course-preview-details">
                                    <div className="preview-detail-item">
                                        <span className="detail-label">🏫 Bölüm:</span>
                                        <span className="detail-value">
                                            {formData.targetDepartmentId ? 
                                                departments?.find(d => d.id === parseInt(formData.targetDepartmentId))?.name || "Bölüm seçin"
                                                : "Bölüm seçin"
                                            }
                                        </span>
                                    </div>
                                    
                                    <div className="preview-detail-item">
                                        <span className="detail-label">🎯 Seviye:</span>
                                        <span className="detail-value">
                                            {formData.targetGradeLevel ? 
                                                `${formData.targetGradeLevel}. Sınıf` 
                                                : "Seviye seçin"
                                            }
                                        </span>
                                    </div>
                                    
                                    <div className="preview-detail-item">
                                        <span className="detail-label">📊 Durum:</span>
                                        <span className={`detail-value status-${formData.courseAccessStatus?.toLowerCase()}`}>
                                            {formData.courseAccessStatus === "Draft" && "📝 Taslak"}
                                            {formData.courseAccessStatus === "Published" && "🌐 Yayınlandı"}
                                            {formData.courseAccessStatus === "Archived" && "📦 Arşivlendi"}
                                            {!formData.courseAccessStatus && "Durum seçin"}
                                        </span>
                                    </div>
                                    
                                    <div className="preview-detail-item">
                                        <span className="detail-label">🔐 Erişim:</span>
                                        <span className={`detail-value ${formData.isAccessible ? 'accessible' : 'not-accessible'}`}>
                                            {formData.isAccessible ? "🔓 Erişilebilir" : "🔒 Erişim Kapalı"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCourse;