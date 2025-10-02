import CourseList from "../components/CourseList"
import useFetch from "../hooks/useFetch"

const Home = () => {

    const {data:courses,loading,error} = useFetch('http://localhost:5225/api/course');
    return (
        <div className="container">
            <div className="row">
                <CourseList courses={courses} loading={loading} error={error} />
            </div>
        </div>
    )
}
export default Home;