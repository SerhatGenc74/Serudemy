import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
const CourseLessons = () => {

    const param = useParams();
    const courseId = param.courseId;
    const {data : lessons, isLoading, error} = useFetch(`http://localhost:5225/api/Lecture/course/${courseId}`);
   
   if(isLoading) return <div>Loading...</div>;
    if(error) return <div>Error: {error.message}</div>;
    return(
        <div>
            <h1>Course Lessons</h1>
           
                
                    <table>
                        <thead>
                            <tr>
                                <th>Lesson ID</th>
                                <th>Lesson Name</th>
                                <th>Lesson Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                             {lessons && lessons.map(lesson => (
                            <tr>
                                <td>{lesson.id}</td>
                                <td>{lesson.name}</td>
                                <td>{lesson.description}</td>
                                <td>
                                    <button>Update Lesson</button>
                                    <button>Delete Lesson</button>
                                </td>
                            </tr>
                             ))}
                        </tbody>
                    </table>
               
           
        </div>

        );
};
export default CourseLessons;