import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/index';
import Admin from './pages/admin/index';
import CourseDetail from './pages/course/Detail';
import Courses from './pages/courses/index';
import Profile from './pages/Profile/index';
import Video from './pages/lesson/Video';
import InstructorDashboard from './pages/dashboard/index';
import CreateCourse from './pages/course/Create';
import EditCourse from './pages/course/Edit';
import CourseLessons from './pages/lesson/Lessons';
import CreateLesson from './pages/lesson/create';
import CourseStudents from './pages/course/Students';
import StudentLectureProgress from './pages/dashboard/StudentLectureProgress';
import Login from './pages/login';
import Register from './pages/login/register';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/shared/ProtectedRoute';
import EditLesson from './pages/lesson/edit';
import EnrollStudents from './pages/course/EnrollStudents';
import Layout from './components/shared/Layout';

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/unauthorized" element={
              <Layout>
                <Unauthorized />
              </Layout>
            } />
            
            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />
            
            <Route path="/courses" element={
              <Layout>
                <Courses />
              </Layout>
            } />
            
            <Route path="/courses/:courseId" element={
              <Layout>
                <CourseDetail />
              </Layout>
            } />
            
            <Route path="/course/:courseId/Video/:lectureId" element={
              <ProtectedRoute>
                <Layout showBreadcrumb={false}>
                  <Video />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile/" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute allowedRole={['Teacher', 'Admin']}>
                <Layout>
                  <Admin />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRole={['Teacher','Admin']}>
                <Layout>
                  <InstructorDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/instructor/create-course" element={
              <ProtectedRoute allowedRole={['Teacher','Admin']}>
                <Layout>
                  <CreateCourse />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/instructor/edit-course/:courseId" element={
              <ProtectedRoute allowedRole={['Teacher','Admin']}>
                <Layout>
                  <EditCourse />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/course/:courseId/lessons" element={
              <ProtectedRoute allowedRole={['Teacher','Admin']}>
                <Layout>
                  <CourseLessons />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/course/:courseId/add-lesson" element={
              <ProtectedRoute allowedRole={['Teacher','Admin']}>
                <Layout>
                  <CreateLesson />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/course/:courseId/students" element={
              <ProtectedRoute allowedRole={['Teacher','Admin']}>
                <Layout>
                  <CourseStudents />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/StudentCourse/course/:courseId/student/:studentId/lectures" 
            element={
              <ProtectedRoute allowedRole={['Teacher','Admin']}>
                <Layout>
                  <StudentLectureProgress />
                </Layout>
              </ProtectedRoute>
            } />
            
             <Route path='/course/:courseId/lecture/:lectureId/edit'
              element={
              <ProtectedRoute allowedRole={['Teacher','Admin']}>
                <Layout>
                  <EditLesson />
                </Layout>
                </ProtectedRoute>} />
                
                <Route path='/course/:courseId/enroll-students' 
                element={
                  <ProtectedRoute allowedRole={['Teacher','Admin']}>
                    <Layout>
                      <EnrollStudents />
                    </Layout>
                  </ProtectedRoute>
                } />

            <Route path="*" element={
              <Layout>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '60vh',
                  textAlign: 'center',
                  color: '#64748b'
                }}>
                  <h1 style={{ fontSize: '4rem', margin: '0 0 20px 0' }}>🔍</h1>
                  <h2 style={{ margin: '0 0 10px 0' }}>Sayfa Bulunamadı</h2>
                  <p style={{ margin: '0 0 30px 0' }}>Aradığınız sayfa mevcut değil.</p>
                  <a href="/" style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}>
                    🏠 Ana Sayfaya Dön
                  </a>
                </div>
              </Layout>
            } />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
