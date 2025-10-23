import React from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useLecturesForCourse from '../../hooks/useLecturesForCourse';
import LessonsLoading from "../../components/lessons/LessonsLoading";
import LessonsError from "../../components/lessons/LessonsError";
import LessonsHeader from "../../components/lessons/LessonsHeader";
import LessonsTable from "../../components/lessons/LessonsTable";
import "../../styles/Lessons.css";

const CourseLessons = () => {
    const param = useParams();
    const courseId = param.courseId;
    const { data: lessons, loading: isLoading, error } = useLecturesForCourse(courseId);
    
    // Loading state
    if (isLoading) {
        return <LessonsLoading />;
    }
    
    // Error state
    if (error) {
        return <LessonsError error={error} />;
    }

    const handleDeleteLesson = (lessonId) => {
        // TODO: Implement delete functionality
        console.log('Delete lesson:', lessonId);
        // Show confirmation dialog and call delete API
    };
    
    return (
        <div className="lessons-container">
            <LessonsHeader courseId={courseId} />
            <LessonsTable 
                lessons={lessons} 
                courseId={courseId} 
                onDeleteLesson={handleDeleteLesson}
            />
        </div>
    );
};

export default CourseLessons;