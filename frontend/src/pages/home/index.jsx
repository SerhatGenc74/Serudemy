import useFetch from "../../hooks/useFetch"
import '../../styles/StudentHome.css'
import useCurrentAccountId from "../../hooks/useAccountId"
import HomeLoading from "../../components/home/HomeLoading"
import HomeError from "../../components/home/HomeError"
import WelcomeSection from "../../components/home/WelcomeSection"
import QuickActions from "../../components/home/QuickActions"
import ContinueLearning from "../../components/home/ContinueLearning"
import RecentActivity from "../../components/home/RecentActivity"

const Home = () => {

    const accountId = useCurrentAccountId();
    const studentId = accountId;
    const {data: enrolledCourses, loading, error} = useFetch(`http://localhost:5225/api/StudentCourse/courses/student/${studentId}`);
    
    if (loading) return <HomeLoading />;
    if (error) return <HomeError />;

    return (
        <div className="student-home-container">
            <div className="student-home-content">
                <WelcomeSection enrolledCoursesCount={enrolledCourses?.length} />
                <QuickActions />
                <ContinueLearning enrolledCourses={enrolledCourses} />
                <RecentActivity />
            </div>
        </div>
    )
}
export default Home;