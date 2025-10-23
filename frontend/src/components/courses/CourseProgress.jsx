import { useMemo } from 'react';
import useFetch from '../../hooks/useFetch';

const useCourseProgress = (studentId, courseId) => {
    const { data: progressData, loading } = useFetch(
        studentId && courseId ? 
        `http://localhost:5225/api/StudentProgress/course/${courseId}/student/${studentId}/progress` : 
        null
    );

    const result = useMemo(() => {
        if (loading) return { percentage: 0, display: '0%', loading: true };
        
        const percentage = progressData || 0;
        return {
            percentage: Math.round(percentage),
            display: `${Math.round(percentage)}%`,
            loading: false
        };
    }, [progressData, loading]);

    return result;
};

export default useCourseProgress;