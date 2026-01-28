import React, { useState, useEffect } from 'react';
import { authService, accountService, departmentService } from '../../../api';
import './StudentManagement.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userEmail: '',
    password: '',
    name: '',
    surname: '',
    userno: '',
    phone: '',
    gender: 'Erkek',
    birthday: '',
    gradeLevel: 1,
    departmentId: '',
    status: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accountsData, departmentsData] = await Promise.all([
        accountService.getAllAccounts(),
        departmentService.getAllDepartments(),
      ]);
      
      // Sadece öğrenci rolüne sahip olanları filtrele (veya tümünü göster)
      setStudents(accountsData || []);
      setDepartments(departmentsData || []);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        gradeLevel: parseInt(formData.gradeLevel),
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        createdAt: new Date().toISOString(),
      };

      await authService.register(submitData);
      
      setSuccess('Öğrenci başarıyla eklendi!');
      setShowModal(false);
      setFormData({
        userEmail: '',
        password: '',
        name: '',
        surname: '',
        userno: '',
        phone: '',
        gender: 'Erkek',
        birthday: '',
        gradeLevel: 1,
        departmentId: '',
        status: true,
      });
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await accountService.deleteAccount(id);
      setSuccess('Öğrenci başarıyla silindi.');
      fetchData();
    } catch (error) {
      setError('Silme işlemi sırasında bir hata oluştu.');
    }
  };

  // Filtreleme
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.userno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !filterDepartment || 
      student.departmentId?.toString() === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="student-management">
      <div className="page-header">
        <div>
          <h1>Öğrenci Yönetimi</h1>
          <p>Öğrenci ekleme, düzenleme ve silme işlemleri</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          ➕ Yeni Öğrenci Ekle
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span> {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>✅</span> {success}
          <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      {/* Filtreler */}
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="İsim, numara veya email ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="filter-select"
        >
          <option value="">Tüm Bölümler</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>

      {/* Öğrenci Tablosu */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Öğrenci No</th>
              <th>Ad Soyad</th>
              <th>E-posta</th>
              <th>Bölüm</th>
              <th>Sınıf</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-message">
                  Henüz öğrenci bulunmuyor.
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.userno || '-'}</td>
                  <td>
                    <div className="student-name">
                      <div className="avatar">
                        {student.name?.charAt(0)?.toUpperCase() || 'Ö'}
                      </div>
                      {student.name} {student.surname}
                    </div>
                  </td>
                  <td>{student.userEmail}</td>
                  <td>{departments.find(d => d.id === student.departmentId)?.name || '-'}</td>
                  <td>{student.gradeLevel ? `${student.gradeLevel}. Sınıf` : '-'}</td>
                  <td>
                    <span className={`status-badge ${student.status ? 'active' : 'inactive'}`}>
                      {student.status ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-danger"
                        onClick={() => handleDelete(student.id)}
                        title="Sil"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Yeni Öğrenci Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Yeni Öğrenci Ekle</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Ad *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Soyad *</label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Öğrenci No *</label>
                  <input
                    type="text"
                    name="userno"
                    value={formData.userno}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>E-posta *</label>
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Şifre *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label>Telefon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Bölüm *</label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seçiniz</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sınıf *</label>
                  <select
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={1}>1. Sınıf</option>
                    <option value={2}>2. Sınıf</option>
                    <option value={3}>3. Sınıf</option>
                    <option value={4}>4. Sınıf</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cinsiyet</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Doğum Tarihi</label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  İptal
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
