import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import '../../styles/Admin.css';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminContent from '../../components/admin/AdminContent';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

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

    return (
        <div className="admin-container">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <AdminContent 
                activeTab={activeTab} 
                stats={stats}
                courses={courses}
                coursesLoading={coursesLoading}
                accounts={accounts}
                accountsLoading={accountsLoading}
                lectures={lectures}
                lecturesLoading={lecturesLoading}
            />
        </div>
    );
};

export default AdminPage;