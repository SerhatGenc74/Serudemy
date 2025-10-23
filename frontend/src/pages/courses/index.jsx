import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import useCurrentAccountId from '../../hooks/useAccountId';
import CoursesHeader from '../../components/courses/CoursesHeader';
import CoursesFilters from '../../components/courses/CoursesFilters';
import CoursesList from '../../components/courses/CoursesList';
import CoursesEmpty from '../../components/courses/CoursesEmpty';
import CoursesLoading from '../../components/courses/CoursesLoading';
import CoursesError from '../../components/courses/CoursesError';
import '../../styles/Courses.css';

const Courses = () => {
    const [searchParams] = useSearchParams();
    const initialFilter = searchParams.get('filter') === 'my-courses' ? 'my-courses' : 'accessible';
    const [filter, setFilter] = useState(initialFilter);
    const [searchTerm, setSearchTerm] = useState('');
    const accountId = useCurrentAccountId();
    
    // Fetch all accessible courses and user's enrolled courses
    const { data: courses, loading, error } = useFetch('http://localhost:5225/api/course');
    const { data: enrolledCourses, loading: enrolledLoading } = useFetch(
        accountId ? `http://localhost:5225/api/StudentCourse/courses/student/${accountId}` : null
    );

    // Update filter when URL changes
    useEffect(() => {
        const filterParam = searchParams.get('filter');
        if (filterParam === 'my-courses') {
            setFilter('my-courses');
        }
    }, [searchParams]);

    // Loading state
    if (loading || enrolledLoading) {
        return <CoursesLoading />;
    }

    // Error state
    if (error) {
        return <CoursesError />;
    }

    // Get courses based on filter
    const getFilteredCourses = () => {
        let coursesToFilter = [];
        
        if (filter === 'my-courses') {
            // Show enrolled courses
            coursesToFilter = enrolledCourses?.map(enrolled => enrolled.courses || enrolled.course || enrolled) || [];
        } else {
            // Show all available courses
            coursesToFilter = courses || [];
        }

        // Apply search filter
        return coursesToFilter.filter(course => {
            const matchesSearch = course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                course.courseOwner?.name?.toLowerCase().includes(searchTerm.toLowerCase());

            if (filter === 'my-courses') return matchesSearch;
            if (filter === 'accessible') return matchesSearch && course.isAccessible;
            
            return matchesSearch;
        });
    };

    const filteredCourses = getFilteredCourses();

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const handleSearchChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div className="courses-container">
            <CoursesHeader 
                filter={filter}
                enrolledCourses={enrolledCourses}
                courses={courses}
            />

            <CoursesFilters 
                filter={filter}
                onFilterChange={handleFilterChange}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                accountId={accountId}
                enrolledCourses={enrolledCourses}
                courses={courses}
            />

            {filteredCourses.length > 0 ? (
                <CoursesList 
                    courses={filteredCourses}
                    filter={filter}
                    accountId={accountId}
                />
            ) : (
                <CoursesEmpty 
                    filter={filter}
                    searchTerm={searchTerm}
                    onFilterChange={handleFilterChange}
                    onClearSearch={handleClearSearch}
                />
            )}
        </div>
    );
};

export default Courses;