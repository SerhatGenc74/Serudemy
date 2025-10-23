import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useLectureCount from '../../hooks/useLectureCount';

// CSS stilleri
const styles = `
.student-progress-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
}

.student-progress {
    max-width: 1000px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

.progress-header {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    padding: 30px;
    text-align: center;
}

.progress-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.progress-subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    font-weight: 400;
}

.progress-stats {
    display: flex;
    justify-content: space-around;
    padding: 25px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}

.stat-item {
    text-align: center;
    padding: 15px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    min-width: 120px;
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #4f46e5;
    margin-bottom: 5px;
}

.stat-label {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 500;
}

.progress-table-container {
    padding: 25px;
}

.progress-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.progress-table th {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    padding: 16px;
    font-weight: 600;
    text-align: left;
    border: none;
    font-size: 0.95rem;
}

.progress-table td {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;
}

.progress-table tbody tr:hover {
    background-color: #f8fafc;
    transition: all 0.2s ease;
}

.progress-table tbody tr:last-child td {
    border-bottom: none;
}

.lecture-name {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.95rem;
}

.status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.status-completed {
    background: #dcfce7;
    color: #166534;
}

.status-progress {
    background: #fef3c7;
    color: #92400e;
}

.status-not-started {
    background: #fee2e2;
    color: #991b1b;
}

.progress-bar-container {
    background: #e2e8f0;
    border-radius: 10px;
    height: 24px;
    overflow: hidden;
    position: relative;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 0.8rem;
    transition: width 0.6s ease;
    position: relative;
}

.progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.watched-time {
    color: #64748b;
    font-weight: 500;
}

.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    font-size: 1.2rem;
    color: #64748b;
}

.error-message {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    font-size: 1.2rem;
    color: #dc2626;
    background: #fee2e2;
    border-radius: 12px;
    margin: 20px;
    padding: 20px;
}

.no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    font-size: 1.2rem;
    color: #64748b;
    background: #f8fafc;
    border-radius: 12px;
    margin: 20px;
    padding: 20px;
}
`;

// CSS'i head'e ekle
if (typeof document !== 'undefined' && !document.getElementById('student-progress-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'student-progress-styles';
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

const StudentLectureProgress = () => {
    const { courseId, studentId } = useParams();
    const { data: progress, loading, error } = useFetch(
        `http://localhost:5225/api/StudentProgress/course/${courseId}/student/${studentId}/progress`
    );
    const { data: finishedLectureCount ,loading: finishedLoading, error: finishedError} = useFetch(`http://localhost:5225/api/StudentProgress/student/${studentId}/course/${courseId}/completed/count`);
    const { data: allLectureCount , loading: allLoading, error: allError } = useLectureCount(courseId);

    if (loading || finishedLoading || allLoading) return <div className="loading-spinner">Yükleniyor...</div>;
    if (error || finishedError || allError) return <div className="error-message">Hata oluştu.</div>;
    if (!progress || !progress.length) return <div className="no-data">İlerleme verisi bulunamadı.</div>;

    const completionPercentage = Math.round((finishedLectureCount?.count / (allLectureCount?.count ?? allLectureCount ?? 1)) * 100) || 0;

    return (
        <div className="student-progress-container">
            <div className="student-progress">
                <div className="progress-header">
                    <h1 className="progress-title">Öğrenci Ders İlerlemesi</h1>
                    <p className="progress-subtitle">Kurs içindeki ders tamamlama durumu</p>
                </div>
                
                <div className="progress-stats">
                    <div className="stat-item">
                        <div className="stat-number">{finishedLectureCount?.count || 0}</div>
                        <div className="stat-label">Tamamlanan</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{allLectureCount?.count || 0}</div>
                        <div className="stat-label">Toplam Ders</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{completionPercentage}%</div>
                        <div className="stat-label">Tamamlanma</div>
                    </div>
                </div>

                <div className="progress-table-container">
                    <table className="progress-table">
                        <thead>
                            <tr>
                                <th>Ders Adı</th>
                                <th>Durum</th>
                                <th>İzlenme Yüzdesi</th>
                                <th>İzlenen Süre</th>
                            </tr>
                        </thead>
                        <tbody>
                            {progress.map((item, idx) => (
                                <tr key={item.lectureId || idx}>
                                    <td>
                                        <div className="lecture-name">{item.lectureName || `Ders ${idx + 1}`}</div>
                                    </td>
                                    <td>
                                        {item.watchedSeconds === 0 ? (
                                            <span className="status-badge status-not-started">
                                                ❌ İzlenmedi
                                            </span>
                                        ) : !item.lecturesCompleted ? (
                                            <span className="status-badge status-progress">
                                                ⏳ Devam Ediyor
                                            </span>
                                        ) : (
                                            <span className="status-badge status-completed">
                                                ✅ Tamamlandı
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="progress-bar-container">
                                            <div
                                                className="progress-bar"
                                                style={{ width: `${item.progressPerc || 0}%` }}
                                            >
                                                {item.progressPerc || 0}%
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="watched-time">
                                            {Math.floor((item.watchedSeconds || 0) / 60)}:{String((item.watchedSeconds || 0) % 60).padStart(2, '0')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentLectureProgress;