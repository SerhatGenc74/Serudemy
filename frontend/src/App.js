import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import StudentManagement from './pages/Admin/StudentManagement';

// Instructor Pages
import InstructorDashboard from './pages/Instructor/Dashboard';
import InstructorCourses from './pages/Instructor/Courses';
import CreateCourse from './pages/Instructor/CreateCourse';
import CourseManagement from './pages/Instructor/CourseManagement';
import LectureScheduleCalendar from './pages/Instructor/CourseManagement/LectureScheduleCalendar';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import MyCourses from './pages/Student/MyCourses';
import WatchCourse from './pages/Student/WatchCourse';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/students" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Layout>
                  <StudentManagement />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/courses" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Layout>
                  <InstructorCourses />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Instructor Routes */}
          <Route 
            path="/instructor/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Instructor', 'Teacher']}>
                <Layout>
                  <InstructorDashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor/courses" 
            element={
              <ProtectedRoute allowedRoles={['Instructor', 'Teacher']}>
                <Layout>
                  <InstructorCourses />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor/create-course" 
            element={
              <ProtectedRoute allowedRoles={['Instructor', 'Teacher']}>
                <Layout>
                  <CreateCourse />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor/courses/:courseId/manage" 
            element={
              <ProtectedRoute allowedRoles={['Instructor', 'Teacher']}>
                <Layout>
                  <CourseManagement />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor/course/:courseId/schedule" 
            element={
              <ProtectedRoute allowedRoles={['Instructor', 'Teacher']}>
                <Layout>
                  <LectureScheduleCalendar />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Student Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <Layout>
                  <StudentDashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/courses" 
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <Layout>
                  <MyCourses />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/courses/:courseId/watch" 
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <WatchCourse />
              </ProtectedRoute>
            } 
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
