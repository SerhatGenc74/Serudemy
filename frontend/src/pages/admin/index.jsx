import React, { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import '../../styles/Admin.css';
import CourseTable from '../../components/CourseTable';
import Lectures from '../../components/LectureTable';
import Dashboard from '../../components/Dashboard';
import UsersTable from '../../components/UsersTable';


const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch data for different entities
    const { data: courses, loading: coursesLoading } = useFetch('http://localhost:5225/api/course');
    const { data: accounts, loading: accountsLoading } = useFetch('http://localhost:5225/api/account');
    const { data: lectures, loading: lecturesLoading } = useFetch('http://localhost:5225/api/lecture');
    const { data: enrollments, loading: enrollmentsLoading } = useFetch('http://localhost:5225/api/studentcourse');

    // Stats calculations
    const stats = {
        totalCourses: courses?.length || 0,
        totalUsers: accounts?.length || 0,
        totalLectures: lectures?.length || 0,
        totalEnrollments: enrollments?.length || 0,
        activeCourses: courses?.filter(c => c.status !== false)?.length || 0,
        activeUsers: accounts?.filter(a => a.status === true)?.length || 0
    };

    

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard stats={stats} />;
            case 'courses':
                return <CourseTable courses={courses} coursesLoading={coursesLoading} />;
            case 'users':
                return <UsersTable accounts={accounts} accountsLoading={accountsLoading} />;
            case 'lectures':
                return <Lectures lectures={lectures} lecturesLoading={lecturesLoading} />;
            default:
                return <Dashboard stats={stats} />;
        }
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <div className="admin-sidebar">
                <div className="admin-logo">
                    <h2>Serudemy Admin</h2>
                </div>
                
                <nav className="admin-nav">
                    <button 
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        📊 Dashboard
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('courses')}
                    >
                        📚 Kurslar
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 Kullanıcılar
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'lectures' ? 'active' : ''}`}
                        onClick={() => setActiveTab('lectures')}
                    >
                        🎥 Videolar
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'enrollments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('enrollments')}
                    >
                        📈 Kayıtlar
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="admin-main">
                <div className="admin-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;