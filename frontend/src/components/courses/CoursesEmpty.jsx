import React from 'react';

const CoursesEmpty = ({ filter, searchTerm, onFilterChange, onClearSearch }) => {
    const getIcon = () => {
        return filter === 'my-courses' ? '📚' : '🔍';
    };

    const getTitle = () => {
        return filter === 'my-courses' 
            ? 'Henüz hiç kurs almadınız' 
            : 'Erişilebilir kurs bulunamadı';
    };

    const getMessage = () => {
        if (filter === 'my-courses') {
            return 'Eğitmeniniz tarafından bir kursa kaydedildiğinizde burada görünecektir.';
        } else {
            return searchTerm 
                ? `"${searchTerm}" araması için erişilebilir kurs bulunamadı.`
                : 'Şu anda erişilebilir kurs bulunmuyor.';
        }
    };

    const renderButton = () => {
        if (filter === 'my-courses') {
            return (
                <button 
                    onClick={() => onFilterChange('accessible')}
                    className="browse-courses-btn"
                >
                    🔓 Erişilebilir Kursları Gör
                </button>
            );
        } else if (searchTerm) {
            return (
                <button 
                    onClick={onClearSearch}
                    className="clear-search-btn"
                >
                    🗑️ Aramayı Temizle
                </button>
            );
        }
        return null;
    };

    return (
        <div className="courses-content">
            <div className="empty-state">
                <div className="empty-icon">{getIcon()}</div>
                <h3>{getTitle()}</h3>
                <p>{getMessage()}</p>
                {renderButton()}
            </div>
        </div>
    );
};

export default CoursesEmpty;