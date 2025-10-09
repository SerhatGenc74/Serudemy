 import {jwtDecode} from 'jwt-decode';
 
 const useCurrentAccountId = () => {

        const token = localStorage.getItem("token");
        if (!token) {
            return null;
        }
        const decode = jwtDecode(token);
        
        return decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    }

    export default useCurrentAccountId;