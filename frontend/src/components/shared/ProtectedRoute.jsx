import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        
        // Token süresini kontrol et
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            localStorage.removeItem("token");
            return <Navigate to="/login" replace />;
        }
        
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        // Eğer allowedRole belirtilmemişse, sadece token kontrolü yap
        if (!allowedRole) {
            return children;
        }
        
        // allowedRole array mi string mi kontrol et
        const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
        
        if (allowedRoles.includes(role)) {
            return children;
        } else {
            return <Navigate to="/unauthorized" replace />;
        }
    } catch (error) {
        console.error("JWT decode error:", error);
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;