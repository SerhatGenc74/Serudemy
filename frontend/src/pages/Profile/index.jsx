import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const Profile = () => {

    const param = useParams();
    const {data:account,loading,error} = useFetch(`http://localhost:5225/api/account/${param.userId}`);
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div>
            <h1>Profile Page</h1>
            {account && (
                <div>   
                    <h2>{account.name}</h2>
                    <h2>{account.surname}</h2>
                    <h2>{account.userno}</h2>
                    <h2>Email: {account.userEmail}</h2>
                    <h2>Status: {account.status ? 'Active' : 'Inactive'}</h2>
                    <h2>Password: {account.password}</h2>

                </div>
            )}
        </div>
    );
}
export default Profile;