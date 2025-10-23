const CourseFormFields = ({ formData, setFormData, departments, loading, error, selectedFile, setSelectedFile }) => {
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    return (
        <div className="form-fields">
            <div className="form-group">
                <label htmlFor="name">Kurs Adı</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Kurs adını girin"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Açıklama</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Kurs açıklamasını girin"
                    rows="4"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="targetDepartmentId">Hedef Bölüm</label>
                <select
                    id="targetDepartmentId"
                    name="targetDepartmentId"
                    value={formData.targetDepartmentId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Bölüm seçin</option>
                    {loading ? (
                        <option disabled>Yükleniyor...</option>
                    ) : error ? (
                        <option disabled>Hata: {error}</option>
                    ) : (
                        departments?.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))
                    )}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="targetGradeLevel">Hedef Sınıf</label>
                <select
                    id="targetGradeLevel"
                    name="targetGradeLevel"
                    value={formData.targetGradeLevel}
                    onChange={handleChange}
                    required
                >
                    <option value="">Sınıf seçin</option>
                    <option value="1">1. Sınıf</option>
                    <option value="2">2. Sınıf</option>
                    <option value="3">3. Sınıf</option>
                    <option value="4">4. Sınıf</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="image">Kurs Görseli</label>
                <input
                    type="file"
                    id="image"
                    onChange={handleFileChange}
                    accept="image/*"
                />
                {selectedFile && (
                    <p className="file-info">Seçilen dosya: {selectedFile.name}</p>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="courseAccessStatus">Kurs Durumu</label>
                <select
                    id="courseAccessStatus"
                    name="courseAccessStatus"
                    value={formData.courseAccessStatus}
                    onChange={handleChange}
                >
                    <option value="Draft">Taslak</option>
                    <option value="Published">Yayınlandı</option>
                    <option value="Archived">Arşivlendi</option>
                </select>
            </div>

            <div className="form-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="isAccessible"
                        checked={formData.isAccessible}
                        onChange={(e) => setFormData({
                            ...formData,
                            isAccessible: e.target.checked
                        })}
                    />
                    Erişilebilir
                </label>
            </div>
        </div>
    );
};

export default CourseFormFields;