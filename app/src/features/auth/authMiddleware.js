import { authService } from "./authService.js";

// Client-side guard check for standard service layer calls
export function requireRole(allowedRoles) {
  const session = authService.getCurrentSession();
  if (!session) {
    throw new Error("Sesi tamat. Sila log masuk semula.");
  }
  
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!rolesArray.includes(session.role)) {
    throw new Error("Akses dinafikan. Anda tidak mempunyai kebenaran untuk melakukan tindakan ini.");
  }
  
  return session;
}

// React authentication route guard helper
export function checkAccess(allowedRoles) {
  const session = authService.getCurrentSession();
  if (!session) return false;
  
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return rolesArray.includes(session.role);
}
