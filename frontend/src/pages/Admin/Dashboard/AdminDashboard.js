import React, { useState, useEffect } from 'react';
import { courseService, accountService } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [courses, accounts] = await Promise.all([
          courseService.getAllCoursesForAdmin(),
          accountService.getAllAccounts(),
        ]);

        // Hesap rollerini ayır (backend'den rol bilgisi geliyorsa)
        const students = accounts.filter(a => 
          a.accountRoles?.some(ar => ar.role?.name?.toLowerCase() === 'student')
        );
        const instructors = accounts.filter(a => 
          a.accountRoles?.some(ar => ar.role?.name?.toLowerCase() === 'instructor')
        );

        setStats({
          totalCourses: courses?.length || 0,
          totalStudents: students?.length || accounts?.length || 0,
          totalInstructors: instructors?.length || 0,
        });
      } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Hoş Geldiniz, {user?.name || 'Admin'}</h1>
        <p>Sistem yönetim paneline hoş geldiniz.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon courses">📚</div>
          <div className="stat-info">
            <h3>{stats.totalCourses}</h3>
            <p>Toplam Kurs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon students">👥</div>
          <div className="stat-info">
            <h3>{stats.totalStudents}</h3>
            <p>Toplam Öğrenci</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon instructors">👨‍🏫</div>
          <div className="stat-info">
            <h3>{stats.totalInstructors}</h3>
            <p>Toplam Eğitmen</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Hızlı İşlemler</h2>
        <div className="actions-grid">
          <a href="/admin/students" className="action-card">
            <span className="action-icon">➕</span>
            <span className="action-label">Öğrenci Ekle</span>
          </a>
          <a href="/admin/courses" className="action-card">
            <span className="action-icon">📋</span>
            <span className="action-label">Kursları Yönet</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
