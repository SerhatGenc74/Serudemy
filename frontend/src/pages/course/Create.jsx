import useFetch from '../../hooks/useFetch';
import { useState } from 'react';
import '../../styles/CreateCourse.css';
import useCurrentAccountId from '../../hooks/useAccountId';
const CreateCourse = () => {

    const [submitMessage,setSubmitMessage] = useState("");
    const [isSubmitting,setIsSubmitting] = useState(false);
    const [selectedFile,setSelectedFile] = useState(null);
    const {data:departments,loading,error} = useFetch('http://localhost:5225/api/department');
    const {data : randomnumber} = useFetch('http://localhost:5225/api/course/random');

     const [formData,setFormData] = useState({
        
        courseId : randomnumber,
        name : "",
        description : "",
        image : "",
        targetDepartmentId : "",
        targetGradeLevel : "",
        courseOwnerID : 9002,
        createdAt : new Date().toISOString(),
        updatedAt : new Date().toISOString()

    })

   const accountId = useCurrentAccountId();
    
 const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try 
        {
            let imageUrl = "";
            
            // Önce dosyayı yükle (eğer dosya seçilmişse)
            if (selectedFile) {
                console.log('Dosya yükleniyor:', selectedFile.name);
                const fileFormData = new FormData();
                fileFormData.append('file', selectedFile);
                
                const fileResponse = await fetch('http://localhost:5225/api/file/upload', {
                    method: 'POST',
                    body: fileFormData // FormData kullandığımız için Content-Type header'ı otomatik ayarlanır
                });
                
                console.log('File upload response status:', fileResponse.status);
                
                if (fileResponse.ok) {
                    const fileResult = await fileResponse.json();
                    imageUrl = fileResult.filePath;
                    console.log('Dosya yüklendi:', fileResult);
                } else {
                    const errorText = await fileResponse.text();
                    console.error('Dosya yükleme hatası:', errorText);
                    throw new Error('Dosya yükleme başarısız: ' + errorText);
                }
            }
            
            // Sonra kursu oluştur
            const submitData = {
                courseId: randomnumber,
                name: formData.name,
                description: formData.description,
                imageUrl: imageUrl, // Yüklenen dosya yolu veya manuel girilen URL
                targetDepartmentId: formData.targetDepartmentId,
                targetGradeLevel: formData.targetGradeLevel,
                courseOwnerId: accountId,
                createdAt: formData.createdAt,
                updatedAt: formData.updatedAt
            };

            console.log('Kurs oluşturma verisi:', submitData);

            const response = await fetch('http://localhost:5225/api/course/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            });
            
            console.log('Course create response status:', response.status);
            

            if (response.ok) 
            {
                setSubmitMessage("✅ Kurs başarıyla oluşturuldu!");
                // Form'u temizle
                setFormData({
                    courseId: randomnumber,
                    name: "",
                    description: "",
                    image: "",
                    categoryId: "",
                    targetDepartmentId: "",
                    targetGradeLevel: "",
                    courseOwnerID: 9002,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            } 
            else 
            {
                const errorData = await response.text();
                throw new Error(errorData || "Kurs oluşturulurken bir hata oluştu.");
            }
        } 
        catch (error) 
        {
            console.error("Error submitting form:", error);
            setSubmitMessage(`❌ Hata: ${error.message}`);
        } 
        finally 
        {
            setIsSubmitting(false);
        }
    };


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })     
        console.log(formData)
    }

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
            
            setFormData({
                ...formData,
                [e.target.name] : file.name
            });
            console.log(formData);
        }
    }
    

    
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
                                    onChange={handleChange} 
                                    placeholder="Örn: React ile Web Geliştirme" 
                                    name='name'
                                    value={formData.name}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">
                                    📄 Kurs Açıklaması
                                </label>
                                <textarea 
                                    className="form-textarea"
                                    onChange={handleChange} 
                                    placeholder="Kursunuz hakkında detaylı bilgi verin..."
                                    name='description'
                                    value={formData.description}
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
                                        name='image'
                                        onChange={handleFileChange} 
                                    />
                                    <div className="file-input-label">
                                        <span className="file-input-icon">📁</span>
                                        <div>
                                            <div>{formData.image ? formData.image.name : "Görsel seçin"}</div>
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
                                    onChange={handleChange}
                                    value={formData.departmentId}
                                    name='targetDepartmentId'
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
                                    onChange={handleChange}
                                    value={formData.classLevel}
                                    name='targetGradeLevel'
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
                            <div className={`preview-value ${!formData.name ? 'empty' : ''}`}>
                                {formData.name || "Henüz girilmedi"}
                            </div>
                        </div>
                        
                        <div className="preview-item">
                            <div className="preview-label">Açıklama:</div>
                            <div className={`preview-value ${!formData.description ? 'empty' : ''}`}>
                                {formData.description || "Henüz girilmedi"}
                            </div>
                        </div>
                        
                        <div className="preview-item">
                            <div className="preview-label">Bölüm:</div>
                            <div className={`preview-value ${!formData.targetDepartmentId ? 'empty' : ''}`}>
                                {departments?.find(d => d.id == formData.targetDepartmentId)?.name || "Seçilmedi"}
                            </div>
                        </div>
                        
                        <div className="preview-item">
                            <div className="preview-label">Sınıf Seviyesi:</div>
                            <div className={`preview-value ${!formData.targetGradeLevel ? 'empty' : ''}`}>
                                {formData.targetGradeLevel ? `${formData.targetGradeLevel}. Sınıf` : "Seçilmedi"}
                            </div>
                        </div>
                        
                        <div className="image-preview">
                            {selectedFile ? (
                                <img 
                                    src={URL.createObjectURL(selectedFile)}
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