import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const CourseDetail = () => {

    const param = useParams();
    const courseId = param.courseId;
    const { data: course, loading, error } = useFetch(`http://localhost:5225/api/course/${courseId}`);
    const {data : videos,loading:videoloading,error:videoerror} = useFetch(`http://localhost:5225/api/StudentProgress/student/6/course/${courseId}/last`);
    const lastwatchedid = videos?.lecturesId; 
    const IsEnrolled = true;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading course details.</p>;
    if (IsEnrolled)
        return (
            <div className='container'>
                <h1>Course Detail Page</h1>
                <div className='course-detail' key={param.courseId}>
                    {course &&
                        <div>
                            <h2>{course.name}</h2>
                            <p>{course.description}</p>
                            <p>Instructor: {course.courseOwner?.name || 'Unknown'}</p>
                            <Link to={`/course/${courseId}/Video/${lastwatchedid}`} style={{ textDecoration: 'none' }}>
                                <button className="btn btn-sm btn-primary">Continue Watching</button>
                            </Link>
                        </div>
                    }
                </div>
            </div>
        );
    else
        return (
        <div className='container'>
        <h1>Course Detail Page</h1>
            <div className='course-detail' key={param.courseId}>
                {course && 
                <div>
                    <h2>{course.name}</h2>
                    <p>{course.description}</p>
                    <p>Instructor: {course.courseOwner?.name || 'Unknown'}</p>
                    <Link to={`/course/${param.courseId}/enroll`} style={{ textDecoration: 'none' }}>
                        <button className="btn btn-sm btn-primary">Enroll Now</button>
                    </Link>
                     </div>
                }
                
            </div>
        </div>
    )
}
export default CourseDetail;