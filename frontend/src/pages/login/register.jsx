import '../../styles/Register.css';
import AuthLayout from '../../components/auth/AuthLayout';
import RegisterBrandSection from '../../components/auth/RegisterBrandSection';
import RegisterForm from '../../components/auth/RegisterForm';

const Register = () => {
    return (
        <AuthLayout type="register">
            <RegisterBrandSection />
            <RegisterForm />
        </AuthLayout>
    );
}

export default Register;