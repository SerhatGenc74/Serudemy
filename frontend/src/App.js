import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import Video from './pages/Video';
import InstructorDashboard from './pages/InstructorDashboard';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import CourseLessons from './pages/CourseLessons';
import CourseStudents from './pages/CourseStudents';
import StudentLectureProgress from './pages/StudentLectureProgress';

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/course/:courseId/Video/:lectureId" element={<Video />} />
            <Route path="/course/:courseId/enroll" element={<div>Enroll Page</div>} />
            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            <Route path="/instructor/create-course" element={<CreateCourse />} />
            <Route path="/instructor/edit-course/:courseId" element={<EditCourse />} />
            <Route path="/course/:courseId/lessons" element={<CourseLessons />} />
            <Route path="/course/:courseId/students" element={<CourseStudents />} />
            <Route path="/StudentCourse/course/:courseId/student/:studentId/lectures" element={<StudentLectureProgress />} />
            
          </Routes>
        </div>
      </Router>
  );
}

export default App;
