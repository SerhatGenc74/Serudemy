
import React from 'react';
import '../../styles/Login.css';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginBrandSection from '../../components/auth/LoginBrandSection';
import LoginForm from '../../components/auth/LoginForm';

const Login = () => {
    return (
        <AuthLayout type="login">
            <LoginBrandSection />
            <LoginForm />
        </AuthLayout>
    );
};

export default Login;