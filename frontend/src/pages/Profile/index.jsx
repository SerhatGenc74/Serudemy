import useFetch from "../../hooks/useFetch";
import '../../styles/Profile.css';
import useCurrentAccountId from "../../hooks/useAccountId";
import ProfileLoading from "../../components/profile/ProfileLoading";
import ProfileError from "../../components/profile/ProfileError";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileAvatar from "../../components/profile/ProfileAvatar";
import ContactInfo from "../../components/profile/ContactInfo";
import PersonalInfo from "../../components/profile/PersonalInfo";
import AcademicInfo from "../../components/profile/AcademicInfo";
import SecurityInfo from "../../components/profile/SecurityInfo";

const Profile = () => {
    const accountId = useCurrentAccountId();
    const {data: account, loading, error} = useFetch(`http://localhost:5225/api/account/${accountId}`);
    
    // Account DTO'sundan direkt department ve faculty bilgilerini al
    const department = account?.department;
    const faculty = department?.faculty;

    if (loading) {
        return <ProfileLoading />;
    }

    if (error || !account) {
        return <ProfileError error={error} />;
    }

    return (
        <div className="profile-container">
            <div className="profile-content">
                <ProfileHeader />

                {/* Main Profile Card */}
                <div className="profile-card">
                    <div className="profile-layout">
                        <ProfileAvatar account={account} />

                        {/* Sağ taraf - Detaylı bilgiler */}
                        <div className="profile-info">
                            <ContactInfo account={account} />
                            <PersonalInfo account={account} />
                            <AcademicInfo account={account} department={department} faculty={faculty} />
                            <SecurityInfo account={account} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;