import React from 'react';
import { Link } from 'react-router-dom';

const CourseList = ({ courses ,loading ,error }) => {

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Kurslar</h2>
            <div className="row">
               {courses && courses.map(course => (
                    <div key={course.id} className="col-md-4">
                        <div className="card mb-4 shadow-sm">
                            <img src={course.fotoUrl} className="card-img-top" alt={course.name} />
                            <div className="card-body">
                                <h5 className="card-title">{course.name}</h5>
                                <Link to={`/courses/${course.courseId}`} style={{ textDecoration: 'none' }}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <button className="btn btn-sm btn-primary">Detaylar</button>
                                </div>
                                 </Link>
                                
                            </div>
                        </div>
                    </div>
               ))}
            </div>
        </div>
    );
};

export default CourseList;