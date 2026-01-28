import { jwtDecode } from 'jwt-decode';

// Token'dan kullanıcı bilgilerini decode et
export const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Token decode hatası:', error);
    return null;
  }
};

// Token'dan rol bilgisini al
export const getRoleFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  // .NET JWT'de rol genellikle bu claim'lerden birinde olur
  return decoded.role || 
         decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
         decoded.roles?.[0] ||
         null;
};

// Token'dan kullanıcı ID'sini al
export const getUserIdFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return decoded.nameid || 
         decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
         decoded.sub ||
         decoded.userId ||
         null;
};

// Token'dan kullanıcı adını al
export const getUserNameFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return decoded.unique_name ||
         decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
         decoded.name ||
         null;
};

// Token'dan email al
export const getEmailFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return decoded.email ||
         decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
         null;
};

// Token geçerli mi kontrol et
export const isTokenValid = (token) => {
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded) return false;
  
  // Token süresi dolmuş mu?
  const currentTime = Date.now() / 1000;
  if (decoded.exp && decoded.exp < currentTime) {
    return false;
  }
  
  return true;
};

// Rol bazlı yönlendirme için dashboard URL'i al
export const getDashboardPath = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return '/admin/dashboard';
    case 'instructor':
    case 'teacher':
      return '/instructor/dashboard';
    case 'student':
      return '/student/dashboard';
    default:
      return '/login';
  }
};

// Kullanıcının belirtilen role sahip olup olmadığını kontrol et
export const hasRole = (token, requiredRole) => {
  const userRole = getRoleFromToken(token);
  if (!userRole) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.some(role => role.toLowerCase() === userRole.toLowerCase());
  }
  
  return userRole.toLowerCase() === requiredRole.toLowerCase();
};

// Token'dan tüm kullanıcı bilgilerini al
export const getUserFromToken = (token) => {
  if (!isTokenValid(token)) return null;
  
  return {
    id: getUserIdFromToken(token),
    name: getUserNameFromToken(token),
    email: getEmailFromToken(token),
    role: getRoleFromToken(token),
  };
};
