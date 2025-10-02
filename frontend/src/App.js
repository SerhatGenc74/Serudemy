import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import Video from './pages/Video';
import InstructorDashboard from './pages/InstructorDashboard';
import CreateCourse from './pages/CreateCourse';

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

          </Routes>
        </div>
      </Router>
  );
}

export default App;
