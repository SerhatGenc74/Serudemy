import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import '../../styles/EnrollStudents.css';

const EnrollStudents = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [enrolling, setEnrolling] = useState({});
    const [enrollMessage, setEnrollMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [enrolledStatus, setEnrolledStatus] = useState({});

    // Kurs bilgilerini al
    const { data: course, loading: courseLoading, error: courseError } = useFetch(`http://localhost:5225/api/Course/${courseId}`);
    // Kursun grade level ve department'ına uygun öğrencileri al
    const { data: eligibleStudents, loading: studentsLoading, error: studentsError } = useFetch(
        courseId ? `http://localhost:5225/api/StudentCourse/eligible-students?courseId=${courseId}` : null
    );
    // Kursa zaten kayıtlı öğrencileri al (StudentCourse kayıtları)
    const { data: enrolledStudents, loading: enrolledLoading, error: enrolledError, refetch: refetchEnrolled } = useFetch(
        `http://localhost:5225/api/StudentCourse/course/${courseId}`
    );

    // Öğrencilerin kayıt durumlarını ve enrollment ID'lerini sakla
    useEffect(() => {
        if (eligibleStudents && eligibleStudents.length > 0 && enrolledStudents) {
            const statusMap = {};
            
            // Kayıtlı öğrencileri map'e ekle
            enrolledStudents.forEach(enrollment => {
                if (enrollment.accountId) {
                    statusMap[enrollment.accountId] = {
                        isEnrolled: true,
                        enrollmentId: enrollment.id // StudentCourse tablosunun ID'si
                    };
                }
            });
            
            // Kayıtlı olmayan öğrencileri ekle
            eligibleStudents.forEach(student => {
                if (!statusMap[student.id]) {
                    statusMap[student.id] = {
                        isEnrolled: false,
                        enrollmentId: null
                    };
                }
            });
            
            setEnrolledStatus(statusMap);
            console.log('Enrollment Status Map:', statusMap);
        }
    }, [eligibleStudents, enrolledStudents]);
    console.log('Enrolled Students:', enrolledStudents);
    // Arama filtresi
    const filteredStudents = eligibleStudents ? eligibleStudents.filter(student => 
        student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleSingleEnrollment = async (studentId, enrollmentInfo) => {
        const enrollKey = `${studentId}`;
        setEnrolling(prev => ({ ...prev, [enrollKey]: true }));
        setEnrollMessage('');

        console.log('=== ENROLLMENT DEBUG ===');
        console.log('Student ID:', studentId);
        console.log('Course ID:', courseId);
        console.log('Enrollment Info:', enrollmentInfo);

        try {
            if (enrollmentInfo?.isEnrolled && enrollmentInfo?.enrollmentId) {
                // Kayıttan çıkar - StudentCourse ID kullan
                const unenrollUrl = `http://localhost:5225/api/StudentCourse/${enrollmentInfo.enrollmentId}`;
                console.log('Unenroll URL (using enrollment ID):', unenrollUrl);
                
                const response = await fetch(unenrollUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Unenroll Response Status:', response.status);

                if (response.ok) {
                    // Durumu güncelle
                    setEnrolledStatus(prev => ({
                        ...prev,
                        [studentId]: { isEnrolled: false, enrollmentId: null }
                    }));
                    
                    // Enrolled students listesini yeniden yükle
                    if (refetchEnrolled) {
                        await refetchEnrolled();
                    }
                    
                    setEnrollMessage(`✅ Öğrenci başarıyla kayıttan çıkarıldı!`);
                } else {
                    const responseText = await response.text();
                    throw new Error(`Kayıttan çıkarma başarısız: ${responseText}`);
                }
            } else {
                // Kayıt et
                const enrollUrl = `http://localhost:5225/api/StudentCourse/enroll/${courseId}/${studentId}`;
                console.log('Enroll URL:', enrollUrl);
                
                const enrollData = {
                    accountId: studentId,
                    courseId: parseInt(courseId),
                    enrolledAt: new Date().toISOString(),
                    completedAt: null,
                    courseCompleted: false,
                    progress: 0
                };
                console.log('Enroll Data:', enrollData);
                
                const response = await fetch(enrollUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(enrollData)
                });

                console.log('Enroll Response Status:', response.status);

                if (response.ok) {
                    const result = await response.json();
                    console.log('Enrollment result:', result);
                    
                    // Durumu güncelle
                    setEnrolledStatus(prev => ({
                        ...prev,
                        [studentId]: { isEnrolled: true, enrollmentId: result.id }
                    }));
                    
                    // Enrolled students listesini yeniden yükle
                    if (refetchEnrolled) {
                        await refetchEnrolled();
                    }
                    
                    setEnrollMessage(`✅ Öğrenci başarıyla kursa kaydedildi!`);
                } else {
                    const responseText = await response.text();
                    throw new Error(`Kayıt işlemi başarısız: ${responseText}`);
                }
            }

            // Mesajı 3 saniye sonra temizle
            setTimeout(() => {
                setEnrollMessage('');
            }, 3000);

        } catch (error) {
            console.error('Enrollment error:', error);
            setEnrollMessage(`❌ Hata: ${error.message}`);
            setTimeout(() => {
                setEnrollMessage('');
            }, 5000);
        } finally {
            setEnrolling(prev => ({ ...prev, [enrollKey]: false }));
        }
    };

    if (courseLoading) {
        return (
            <div className="enroll-students-container">
                <div className="loading-container">
                    <div className="loading-spinner">🔄</div>
                    <div className="loading-text">Kurs bilgileri yükleniyor...</div>
                </div>
            </div>
        );
    }

    if (courseError || !course) {
        return (
            <div className="enroll-students-container">
                <div className="error-container">
                    <div className="error-text">❌ Kurs bulunamadı: {courseError?.message}</div>
                    <button 
                        className="btn btn-back"
                        onClick={() => navigate('/instructor/dashboard')}
                    >
                        ← Dashboard'a Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="enroll-students-container">
            <div className="enroll-students-content">
                <button 
                    className="back-button"
                    onClick={() => navigate('/instructor/dashboard')}
                    title="Dashboard'a dön"
                >
                    ← Dashboard'a Dön
                </button>

                <div className="page-header">
                    <h1 className="page-title">👥 Öğrenci Kayıt</h1>
                    <p className="page-subtitle">Bu kursa uygun öğrencileri seçin ve kaydedin</p>
                </div>

                <div className="course-info-card">
                    <div className="course-details">
                        <h2 className="course-name">{course.name}</h2>
                        <div className="course-meta">
                            <span className="meta-item">
                                🎓 Seviye: {course.targetGradeLevel}
                            </span>
                            <span className="meta-item">
                                🏢 Bölüm Adı: {course.targetDepartment.name}
                            </span>
                            <span className="meta-item">
                                👥 Kayıtlı: {enrolledStudents?.length || 0} öğrenci
                            </span>
                        </div>
                    </div>
                </div>

                <div className="students-section">
                    <div className="section-header">
                        <h3 className="section-title">� Öğrenci Yönetimi</h3>
                        <div className="section-controls">
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="🔍 Öğrenci ara (isim, email, numara...)"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <div className="selection-info">
                                {selectedStudents.length > 0 && (
                                    <span className="selected-count">
                                        {selectedStudents.length} öğrenci seçildi
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {studentsLoading ? (
                        <div className="loading-container">
                            <div className="loading-spinner">🔄</div>
                            <div className="loading-text">Öğrenciler yükleniyor...</div>
                        </div>
                    ) : studentsError ? (
                        <div className="error-container">
                            <div className="error-text">❌ Öğrenciler yüklenirken hata: {studentsError.message}</div>
                        </div>
                    ) : (
                        <div className="students-sections">
                            {/* Genel Mesaj */}
                            {enrollMessage && (
                                <div className={`enrollment-message ${enrollMessage.includes('✅') ? 'success' : 'error'}`}>
                                    {enrollMessage}
                                </div>
                            )}

                            {/* Tüm Uygun Öğrenciler */}
                            {filteredStudents.length > 0 ? (
                                <div className="student-group all-students-group">
                                    <div className="group-header">
                                        <h4 className="group-title">👥 Uygun Öğrenciler ({filteredStudents.length})</h4>
                                    </div>

                                    <div className="students-grid">
                                        {filteredStudents.map((student) => {
                                            const enrollmentInfo = enrolledStatus[student.id] || { isEnrolled: false, enrollmentId: null };
                                            const isProcessing = enrolling[`${student.id}`];
                                            
                                            return (
                                                <div 
                                                    key={student.id} 
                                                    className={`student-card ${enrollmentInfo.isEnrolled ? 'enrolled' : 'not-enrolled'}`}
                                                >
                                                    <div className="student-info">
                                                        <div className={`student-avatar ${enrollmentInfo.isEnrolled ? 'enrolled' : 'not-enrolled'}`}>
                                                            {enrollmentInfo.isEnrolled ? '✅' : '➕'}
                                                        </div>
                                                        <div className="student-details">
                                                            <h4 className="student-name">
                                                                {student.firstName} {student.lastName}
                                                            </h4>
                                                            <div className="student-meta">
                                                                <span className="student-number">
                                                                    🆔 {student.studentNumber}
                                                                </span>
                                                                <span className="student-email">
                                                                    ✉️ {student.email}
                                                                </span>
                                                                <span className="student-grade">
                                                                    🎓 {student.gradeLevel}. Sınıf
                                                                </span>
                                                                <span className={`status-badge ${enrollmentInfo.isEnrolled ? 'enrolled' : 'available'}`}>
                                                                    {enrollmentInfo.isEnrolled ? '✓ Kayıtlı' : '⭐ Uygun'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="student-actions">
                                                        <button
                                                            className={`btn-action ${enrollmentInfo.isEnrolled ? 'unenroll' : 'enroll'}`}
                                                            onClick={() => handleSingleEnrollment(student.id, enrollmentInfo)}
                                                            disabled={isProcessing}
                                                        >
                                                            {isProcessing ? (
                                                                <>
                                                                    <span className="loading-spinner">🔄</span>
                                                                    İşleniyor...
                                                                </>
                                                            ) : enrollmentInfo.isEnrolled ? (
                                                                '❌ Kayıttan Çıkar'
                                                            ) : (
                                                                '➕ Kursa Kaydet'
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">👥</div>
                                    <div className="empty-title">
                                        {searchTerm ? 'Arama sonucu bulunamadı' : 'Uygun öğrenci bulunamadı'}
                                    </div>
                                    <div className="empty-description">
                                        {searchTerm ? 
                                            'Arama kriterlerinizi değiştirerek tekrar deneyin.' :
                                            'Bu kursun seviye ve bölüm kriterlerine uygun öğrenci bulunmuyor.'
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnrollStudents;