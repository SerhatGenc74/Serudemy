import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/index';
import Admin from './pages/admin/index';
import CourseDetail from './pages/course/Detail';
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
import ProtectedRoute from './components/ProtectedRoute';
import EditLesson from './pages/lesson/edit';
import EnrollStudents from './pages/course/EnrollStudents';

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<Home />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            
            {/* Protected Routes - Sadece Giriş Yapmış Kullanıcılar */}
            <Route path="/profile/:userId" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/course/:courseId/Video/:lectureId"  element={
              <ProtectedRoute>
                <Video />
              </ProtectedRoute>
            } />
            
            {/* Admin/Teacher Only Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRole={['Öğretmen', 'Admin']}>
                <Admin />
              </ProtectedRoute>
            } />
            
            <Route path="/instructor/dashboard" element={
              <ProtectedRoute allowedRole={['Öğretmen']}>
                <InstructorDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/instructor/create-course" element={
              <ProtectedRoute allowedRole={['Öğretmen']}>
                <CreateCourse />
              </ProtectedRoute>
            } />
            
            <Route path="/instructor/edit-course/:courseId" element={
              <ProtectedRoute allowedRole={['Öğretmen']}>
                <EditCourse />
              </ProtectedRoute>
            } />
            
            <Route path="/course/:courseId/lessons" element={
              <ProtectedRoute allowedRole={['Öğretmen']}>
                <CourseLessons />
              </ProtectedRoute>
            } />
            
            <Route path="/course/:courseId/add-lesson" element={
              <ProtectedRoute allowedRole={['Öğretmen']}>
                <CreateLesson />
              </ProtectedRoute>
            } />
            
            <Route path="/course/:courseId/students" element={
              <ProtectedRoute allowedRole={['Öğretmen']}>
                <CourseStudents />
              </ProtectedRoute>
            } />
            
            {/* Student Routes */}
            <Route path="/StudentCourse/course/:courseId/student/:studentId/lectures" 
            element={
              <ProtectedRoute allowedRole={['Öğretmen']}>
                <StudentLectureProgress />
              </ProtectedRoute>
            } />
            
             <Route path='/course/:courseId/lecture/:lectureId/edit'
              element={
              <ProtectedRoute allowedRole={['Öğretmen']}>
                  <EditLesson />
                </ProtectedRoute>} />
                
                <Route path='/course/:courseId/enroll-students' 
                element={
                  <ProtectedRoute allowedRole={['Öğretmen']}>
                    <EnrollStudents />
                  </ProtectedRoute>
                } />

            {/* 404 Route */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
