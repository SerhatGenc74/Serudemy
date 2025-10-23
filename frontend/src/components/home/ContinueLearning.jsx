import { Link } from "react-router-dom";

const ContinueLearning = ({ enrolledCourses }) => {
    if (!enrolledCourses || enrolledCourses.length === 0) {
        return null;
    }

    return (
        <div className="continue-learning">
            <h2 className="section-title">
                📖 Öğrenmeye Devam Et
            </h2>
            
            <div className="continue-courses">
                {enrolledCourses.slice(0, 3).map((courseData) => {
                    const course = courseData.course || courseData;
                    return (
                        <div key={course.courseId} className="continue-course-card">
                            <div className="course-thumbnail">📖</div>
                            <div className="course-details">
                                <h4>{course.name}</h4>
                                <p>👨‍🏫 {course.courseOwner?.name || 'Eğitmen'}</p>
                                <div className="progress-mini">
                                    <div className="progress-bar-mini">
                                        <div className="progress-fill-mini" style={{width: '65%'}}></div>
                                    </div>
                                    <span>65%</span>
                                </div>
                            </div>
                            <Link 
                                to={`/courses/${course.courseId}`}
                                className="continue-btn"
                            >
                                ▶️
                            </Link>
                        </div>
                    );
                })}
            </div>
            
            <Link to="/courses?filter=my-courses" className="view-all-courses">
                Tüm Kurslarımı Gör →
            </Link>
        </div>
    );
};

export default ContinueLearning;