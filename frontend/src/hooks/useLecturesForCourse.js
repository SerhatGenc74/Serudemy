import useFetch from './useFetch';

// Simple wrapper that returns the lecture list for a given courseId
const useLecturesForCourse = (courseId) => {
    const url = courseId ? `http://localhost:5225/api/Lecture/course/${courseId}` : null;
    const { data, loading, error, refetch } = useFetch(url);
    return { data, loading, error, refetch };
};

export default useLecturesForCourse;
