import React from 'react';

const CoursesFilters = ({ 
    filter, 
    onFilterChange, 
    searchTerm, 
    onSearchChange, 
    accountId, 
    enrolledCourses, 
    courses 
}) => {
    return (
        <div className="courses-filters">
            <div className="filter-tabs">
                {accountId && (
                    <button 
                        className={`filter-tab ${filter === 'my-courses' ? 'active' : ''}`}
                        onClick={() => onFilterChange('my-courses')}
                    >
                        📖 Kurslarım ({enrolledCourses?.length || 0})
                    </button>
                )}
                <button 
                    className={`filter-tab ${filter === 'accessible' ? 'active' : ''}`}
                    onClick={() => onFilterChange('accessible')}
                >
                    🔓 Erişilebilir Kurslar ({courses?.filter(c => c.isAccessible).length || 0})
                </button>
            </div>

            <div className="search-box">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Kurs adı, açıklama veya eğitmen ara..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="search-input"
                    />
                    <div className="search-icon">🔍</div>
                </div>
            </div>
        </div>
    );
};

export default CoursesFilters;