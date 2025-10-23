import React from 'react';
import CourseCard from './CourseCard';

const CoursesList = ({ courses, filter, accountId }) => {
    return (
        <div className="courses-content">
            <div className="courses-grid">
                {courses.map((course) => (
                    <CourseCard 
                        key={course.courseId} 
                        course={course} 
                        filter={filter} 
                        accountId={accountId} 
                    />
                ))}
            </div>
        </div>
    );
};

export default CoursesList;