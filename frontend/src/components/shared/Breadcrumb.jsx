import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import '../../styles/Breadcrumb.css';

const Breadcrumb = () => {
    const location = useLocation();
    const params = useParams();
    const { courseId, lectureId } = params;
    
    // Fetch course data if we're in a course-related page
    const { data: courseData } = useFetch(
        courseId ? `http://localhost:5225/api/course/${courseId}` : null
    );
    
    // Fetch lecture data if we're in a lecture-related page
    const { data: lectureData } = useFetch(
        lectureId ? `http://localhost:5225/api/Lecture/${lectureId}` : null
    );

    // Define route mappings for breadcrumb generation
    const routeMap = {
        '/': { label: '🏠 Ana Sayfa', icon: '🏠' },
        '/courses': { label: '📚 Kurslar', icon: '📚' },
        '/profile': { label: '👤 Profil', icon: '👤' },
        '/dashboard': { label: '📊 Eğitmen Paneli', icon: '📊' },
        '/admin': { label: '⚙️ Yönetim Paneli', icon: '⚙️' },
        '/login': { label: '🔐 Giriş', icon: '🔐' },
        '/register': { label: '📝 Kayıt', icon: '📝' },
        '/my-courses': { label: '📖 Kurslarım', icon: '📖' },
        '/unauthorized': { label: '🚫 Yetkisiz Erişim', icon: '🚫' }
    };

    // Generate breadcrumb items based on current path
    const generateBreadcrumbs = () => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const breadcrumbs = [{ path: '/', label: '🏠 Ana Sayfa', icon: '🏠' }];
        let currentPath = '';

        // Kurslar
        if (pathSegments.includes('courses')) {
            currentPath = '/courses';
            breadcrumbs.push({ path: currentPath, label: '� Kurslar', icon: '�' });
        }

        // Kurs detay
        if (courseId && courseData) {
            currentPath = `/courses/${courseId}`;
            breadcrumbs.push({ path: currentPath, label: `📖 ${courseData.name}`, icon: '📖' });
        }

        // Dersler listesi
        if (pathSegments.includes('lessons')) {
            currentPath = `/course/${courseId}/lessons`;
            breadcrumbs.push({ path: currentPath, label: '📝 Dersler', icon: '📝' });
        }

        // Tekil ders
        if (lectureId && lectureData) {
            currentPath = `/course/${courseId}/lecture/${lectureId}`;
            breadcrumbs.push({ path: currentPath, label: `🎥 ${lectureData.name}`, icon: '🎥' });
        }

        // Video izleme
        if (pathSegments.includes('Video')) {
            breadcrumbs.push({ path: location.pathname, label: '▶️ Video İzle', icon: '▶️' });
        }

        // Düzenle
        if (pathSegments.includes('edit')) {
            breadcrumbs.push({ path: location.pathname, label: '✏️ Düzenle', icon: '✏️' });
        }

        // Oluştur
        if (pathSegments.includes('create') || pathSegments.includes('add-lesson')) {
            breadcrumbs.push({ path: location.pathname, label: '➕ Oluştur', icon: '➕' });
        }

        // Diğer özel segmentler
        if (pathSegments.includes('enroll-students')) {
            breadcrumbs.push({ path: location.pathname, label: '👥 Öğrenci Kayıt', icon: '👥' });
        }
        if (pathSegments.includes('student-progress')) {
            breadcrumbs.push({ path: location.pathname, label: '� Öğrenci İlerlemesi', icon: '�' });
        }

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    // Don't show breadcrumb on login/register pages
    if (['/login', '/register'].includes(location.pathname)) {
        return null;
    }

    // Don't show breadcrumb if it's just the home page
    if (breadcrumbs.length <= 1 && location.pathname === '/') {
        return null;
    }

    return (
        <nav className="breadcrumb" aria-label="Breadcrumb">
            <div className="breadcrumb-container">
                <ol className="breadcrumb-list">
                    {breadcrumbs.map((crumb, index) => (
                        <li
                            key={crumb.path}
                            className={`breadcrumb-item ${
                                index === breadcrumbs.length - 1 ? 'active' : ''
                            }`}
                        >
                            {index === breadcrumbs.length - 1 ? (
                                // Current page - not clickable
                                <span className="breadcrumb-current">
                                    <span className="breadcrumb-icon">{crumb.icon}</span>
                                    <span className="breadcrumb-text">{crumb.label}</span>
                                </span>
                            ) : (
                                // Previous pages - clickable
                                <Link to={crumb.path} className="breadcrumb-link">
                                    <span className="breadcrumb-icon">{crumb.icon}</span>
                                    <span className="breadcrumb-text">{crumb.label}</span>
                                </Link>
                            )}
                            
                            {index < breadcrumbs.length - 1 && (
                                <span className="breadcrumb-separator" aria-hidden="true">
                                    <svg
                                        width="6"
                                        height="10"
                                        viewBox="0 0 6 10"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1 1L5 5L1 9"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    );
};

export default Breadcrumb;