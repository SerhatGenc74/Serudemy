import Dashboard from './Dashboard';
import CourseTable from './CourseTable';
import UsersTable from './UsersTable';
import Lectures from './LectureTable';

const AdminContent = ({ activeTab, stats, courses, coursesLoading, accounts, accountsLoading, lectures, lecturesLoading }) => {
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard stats={stats} />;
            case 'courses':
                return <CourseTable courses={courses} coursesLoading={coursesLoading} />;
            case 'users':
                return <UsersTable accounts={accounts} accountsLoading={accountsLoading} />;
            case 'lectures':
                return <Lectures lectures={lectures} lecturesLoading={lecturesLoading} />;
            default:
                return <Dashboard stats={stats} />;
        }
    };

    return (
        <div className="admin-main">
            <div className="admin-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminContent;