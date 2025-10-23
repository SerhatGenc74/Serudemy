const AuthLayout = ({ children, type = "login" }) => {
    return (
        <div className={`${type}-container`}>
            <div className={`${type}-wrapper`}>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;