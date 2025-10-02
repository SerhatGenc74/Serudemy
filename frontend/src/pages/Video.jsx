import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Link } from "react-router-dom";

const Video = () => {
    

    const param = useParams();
    const { data: lecture, loading, error } = useFetch(`http://localhost:5225/api/Lecture/${param.lectureId}`);
    const {data:alllectures,loading:alllecturesloading,error:alllectureserror} = useFetch(`http://localhost:5225/api/Lecture/course/${param.courseId}`);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading video.</p>;

    return (
        <div className="container">
            <h1>Video Page</h1>
            <p>{lecture?.title}</p>
            <Link to="/">Go to Home</Link>
            <video width="600" controls>
                <source src={lecture?.lectureId} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="sidebar">
            <h2>All Lectures</h2>
            {alllecturesloading && <p>Loading lectures...</p>}
            {alllectureserror && <p>Error loading lectures: {alllectureserror}</p>}
            <ul>
                <li>
                    {alllectures && alllectures.map((lec) => (
                        <div key={lec.lectureId}>
                            <Link to={`/course/${param.courseId}/Video/${lec.id}`} style={{ textDecoration: 'none' }}>
                                {lec.name}
                            </Link>
                        </div>
                    ))}
                </li>
            </ul>
            </div>
        </div>
       

        
        
        

    );
}
export default Video;
