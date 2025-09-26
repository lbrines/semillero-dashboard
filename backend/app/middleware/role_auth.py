"""
Role-based authentication middleware for FastAPI
Compatible with FastAPI 0.104.0+ and Pydantic 2.4.0+
"""

from typing import List, Optional
from fastapi import HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import logging

logger = logging.getLogger(__name__)

# Security scheme for JWT tokens
security = HTTPBearer(auto_error=False)


class RoleAuthMiddleware:
    """Middleware for role-based authentication using email whitelist"""
    
    def __init__(self):
        self.roles_whitelist = self._load_roles_whitelist()
        self.demo_mode = os.getenv("DEMO_MODE", "mock")
        
    def _load_roles_whitelist(self) -> dict:
        """Load roles whitelist from environment variables"""
        whitelist_str = os.getenv("ROLES_WHITELIST", "")
        if not whitelist_str:
            # Default mock whitelist for development
            return {
                "student": ["student1@instituto.edu", "student2@instituto.edu"],
                "teacher": ["teacher1@instituto.edu", "teacher2@instituto.edu"],
                "coordinator": ["coord.ecommerce@instituto.edu", "coord.marketing@instituto.edu"],
                "admin": ["admin@instituto.edu"]
            }
        
        # Parse whitelist from environment variable
        roles = {}
        for role_entry in whitelist_str.split(";"):
            if ":" in role_entry:
                role, emails = role_entry.split(":", 1)
                roles[role.strip()] = [email.strip() for email in emails.split(",")]
        return roles
    
    def get_user_role(self, email: str) -> Optional[str]:
        """Get user role from email whitelist"""
        for role, emails in self.roles_whitelist.items():
            if email in emails:
                return role
        return None
    
    def validate_role_permission(self, user_role: str, required_roles: List[str]) -> bool:
        """Validate if user role has required permissions"""
        if not user_role:
            return False
        
        # Role hierarchy: administrador > coordinador > docente > estudiante
        role_hierarchy = {
            "administrador": 4,
            "coordinador": 3,
            "docente": 2,
            "estudiante": 1
        }
        
        user_level = role_hierarchy.get(user_role, 0)
        
        for required_role in required_roles:
            required_level = role_hierarchy.get(required_role, 0)
            if user_level >= required_level:
                return True
        
        return False
    
    async def authenticate_user(self, request: Request) -> Optional[dict]:
        """Authenticate user and return user information"""
        try:
            # In MOCK mode, use email from headers or default
            if self.demo_mode == "mock":
                # Get email from X-User-Email header (for mock authentication)
                email = request.headers.get("X-User-Email", "admin@instituto.edu")
                role = self.get_user_role(email)
                
                if role:
                    return {
                        "email": email,
                        "role": role,
                        "permissions": self._get_role_permissions(role)
                    }
            
            # In Google mode, validate JWT token (WOW optional)
            elif self.demo_mode == "google":
                credentials: HTTPAuthorizationCredentials = await security(request)
                if credentials:
                    # TODO: Implement JWT validation for Google OAuth
                    # For now, return mock user
                    return {
                        "email": "admin@instituto.edu",
                        "role": "admin",
                        "permissions": self._get_role_permissions("admin")
                    }
            
            return None
            
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            return None
    
    def _get_role_permissions(self, role: str) -> List[str]:
        """Get permissions for a specific role"""
        permissions_map = {
            "student": ["VIEW_OWN_PROGRESS"],
            "teacher": ["VIEW_OWN_PROGRESS", "VIEW_COURSE_STUDENTS", "STUDENTS_SEARCH"],
            "coordinator": ["VIEW_OWN_PROGRESS", "VIEW_COURSE_STUDENTS", "VIEW_COHORT_REPORTS", "STUDENTS_SEARCH"],
            "admin": ["VIEW_OWN_PROGRESS", "VIEW_COURSE_STUDENTS", "VIEW_COHORT_REPORTS", "VIEW_GLOBAL_REPORTS", "STUDENTS_SEARCH"]
        }
        return permissions_map.get(role, [])
    
    def require_roles(self, *required_roles: str):
        """Decorator to require specific roles for endpoint access"""
        def decorator(func):
            async def wrapper(*args, **kwargs):
                # Get request from kwargs (FastAPI dependency injection)
                request = None
                for arg in args:
                    if isinstance(arg, Request):
                        request = arg
                        break
                
                if not request:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Request object not found"
                    )
                
                # Authenticate user
                user = await self.authenticate_user(request)
                if not user:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Authentication required"
                    )
                
                # Validate role permissions
                if not self.validate_role_permission(user["role"], list(required_roles)):
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Access denied. Required roles: {required_roles}"
                    )
                
                # Add user to request state for use in endpoint
                request.state.user = user
                
                return await func(*args, **kwargs)
            return wrapper
        return decorator


# Global instance
role_auth = RoleAuthMiddleware()
