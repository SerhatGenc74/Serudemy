import React from 'react';
import useLectureCount from '../../hooks/useLectureCount';

const LectureCount = ({ courseId }) => {
    const { data, loading } = useLectureCount(courseId);

    if (loading) return '- ders';
    const count = data?.count ?? (typeof data === 'number' ? data : 0);
    return `${count} ders`;
};

export default LectureCount;