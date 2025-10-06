import { useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import '../styles/EditCourse.css'; // CSS dosyasını içe aktar

const EditCourse = () => {

    const params = useParams();
    const {data:course,loading,error} = useFetch(`http://localhost:5225/api/Course/${params.courseId}`);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image ,setImage] = useState(null);
    

    return (
        <div className="edit-course-container">
            <div className="edit-course-card">
                <div className="edit-course-header">
                    <h1 className="edit-course-title">✏️ Kurs Düzenle</h1>
                    <p className="edit-course-subtitle">Kurs bilgilerini güncelleyin ve değişiklikleri kaydedin</p>
                </div>
                
                <div className="edit-course-content">
                    <div className="form-section">
                        <form className="edit-course-form" onSubmit={(e)=> {
                            e.preventDefault();
                            alert(`Kurs güncellendi!\nAd: ${name}\nAçıklama: ${description}\nResim: ${image ? image.name : "Seçilmedi"}`);
                        }}>
                            <div className="form-group">
                                <label className="form-label">📚 Kurs Adı</label>
                                <input 
                                    className="form-input"
                                    onChange={(e) => setName(e.target.value)}  
                                    type="text" 
                                    placeholder="Kurs adını girin..." 
                                    value={course?.name || name}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">📝 Kurs Açıklaması</label>
                                <textarea 
                                    className="form-textarea"
                                    onChange={(e) => setDescription(e.target.value)} 
                                    placeholder="Kurs hakkında detaylı açıklama yazın..."
                                    value={course?.description || description}
                                ></textarea>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">🖼️ Kurs Görseli</label>
                                <div className="file-input-wrapper">
                                    <input 
                                        className="file-input"
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} 
                                    />
                                    <div className="file-input-label">
                                        <span>📁</span>
                                        <span>{course?.imageUrl ? course.imageUrl : "Görsel seçin veya sürükleyin"}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button className="submit-btn" type="submit">
                                💾 Değişiklikleri Kaydet
                            </button>
                        </form>
                    </div>
                    
                    <div className="preview-section">
                        <h3 className="preview-title">
                            👁️ Önizleme
                        </h3>
                        
                        <div className="preview-item">
                            <div className="preview-label">Kurs Adı:</div>
                            <div className="preview-value">{name || "Henüz girilmedi"}</div>
                        </div>
                        
                        <div className="preview-item">
                            <div className="preview-label">Açıklama:</div>
                            <div className="preview-value">{description || "Henüz girilmedi"}</div>
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
    )
}
export default EditCourse;
