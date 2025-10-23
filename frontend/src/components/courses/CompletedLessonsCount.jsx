// eslint-disable-next-line no-unused-vars
import React from 'react';
import useFetch from '../../hooks/useFetch';

const CompletedLessonsCount = ({ studentId, courseId }) => {
    const { data: completedData, loading } = useFetch(
        studentId && courseId ? 
        `http://localhost:5225/api/StudentProgress/student/${studentId}/course/${courseId}/completed/count` : 
        null
    );

    if (loading) return '- ders tamamlandı';
    
    const count = completedData?.count || 0;
    return `${count} ders tamamlandı`;
};

export default CompletedLessonsCount;