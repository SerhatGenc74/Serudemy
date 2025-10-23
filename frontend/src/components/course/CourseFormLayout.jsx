const CourseFormLayout = ({ children, title, subtitle }) => {
    return (
        <div className="create-course-container">
            <div className="form-header">
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
            <div className="form-content">
                {children}
            </div>
        </div>
    );
};

export default CourseFormLayout;