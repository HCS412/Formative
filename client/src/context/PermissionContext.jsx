import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const PermissionContext = createContext(null);

export function PermissionProvider({ children }) {
  const { user, token } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [features, setFeatures] = useState([]);
  const [subscription, setSubscription] = useState({ tier: 'free' });
  const [loading, setLoading] = useState(true);

  // Fetch permissions when user logs in
  useEffect(() => {
    if (user && token) {
      fetchPermissions();
    } else {
      // Reset on logout
      setPermissions([]);
      setRoles([]);
      setTeams([]);
      setFeatures([]);
      setSubscription({ tier: 'free' });
      setLoading(false);
    }
  }, [user, token]);

  const fetchPermissions = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/auth/permissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPermissions(data.permissions || []);
        setRoles(data.roles || []);
        setTeams(data.teams || []);
        setFeatures(data.features || []);
        setSubscription(data.subscription || { tier: 'free' });
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Check if user has a specific permission
  const hasPermission = useCallback((permission) => {
    // Admins have all permissions
    if (roles.includes('admin')) return true;
    return permissions.includes(permission);
  }, [permissions, roles]);

  // Check if user has any of the specified permissions
  const hasAnyPermission = useCallback((...requiredPermissions) => {
    if (roles.includes('admin')) return true;
    return requiredPermissions.some(p => permissions.includes(p));
  }, [permissions, roles]);

  // Check if user has all of the specified permissions
  const hasAllPermissions = useCallback((...requiredPermissions) => {
    if (roles.includes('admin')) return true;
    return requiredPermissions.every(p => permissions.includes(p));
  }, [permissions, roles]);

  // Check if user has a specific role
  const hasRole = useCallback((role) => {
    return roles.includes(role) || user?.userType === role;
  }, [roles, user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((...requiredRoles) => {
    return requiredRoles.some(r => roles.includes(r) || user?.userType === r);
  }, [roles, user]);

  // Check if a feature flag is enabled
  const isFeatureEnabled = useCallback((featureName) => {
    return features.includes(featureName);
  }, [features]);

  // Check subscription tier
  const hasTier = useCallback((tier) => {
    const tierOrder = ['free', 'starter', 'pro', 'enterprise'];
    const currentIndex = tierOrder.indexOf(subscription.tier || 'free');
    const requiredIndex = tierOrder.indexOf(tier);
    return currentIndex >= requiredIndex;
  }, [subscription]);

  // Check if user is member of a team
  const isTeamMember = useCallback((teamId) => {
    return teams.some(t => t.id === teamId);
  }, [teams]);

  // Get user's role in a team
  const getTeamRole = useCallback((teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team?.role_name || null;
  }, [teams]);

  const value = {
    permissions,
    roles,
    teams,
    features,
    subscription,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isFeatureEnabled,
    hasTier,
    isTeamMember,
    getTeamRole,
    refreshPermissions: fetchPermissions
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}

// HOC for permission-based rendering
export function withPermission(WrappedComponent, requiredPermission) {
  return function PermissionWrapper(props) {
    const { hasPermission, loading } = usePermissions();
    
    if (loading) return null;
    if (!hasPermission(requiredPermission)) return null;
    
    return <WrappedComponent {...props} />;
  };
}

// Component for conditional rendering based on permission
export function Permission({ requires, any, all, fallback = null, children }) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions();
  
  if (loading) return null;
  
  let hasAccess = false;
  
  if (requires) {
    hasAccess = hasPermission(requires);
  } else if (any) {
    hasAccess = hasAnyPermission(...(Array.isArray(any) ? any : [any]));
  } else if (all) {
    hasAccess = hasAllPermissions(...(Array.isArray(all) ? all : [all]));
  }
  
  return hasAccess ? children : fallback;
}

// Component for conditional rendering based on role
export function Role({ requires, any, fallback = null, children }) {
  const { hasRole, hasAnyRole, loading } = usePermissions();
  
  if (loading) return null;
  
  let hasAccess = false;
  
  if (requires) {
    hasAccess = hasRole(requires);
  } else if (any) {
    hasAccess = hasAnyRole(...(Array.isArray(any) ? any : [any]));
  }
  
  return hasAccess ? children : fallback;
}

// Component for conditional rendering based on feature flag
export function Feature({ name, fallback = null, children }) {
  const { isFeatureEnabled, loading } = usePermissions();
  
  if (loading) return null;
  
  return isFeatureEnabled(name) ? children : fallback;
}

// Component for conditional rendering based on subscription tier
export function Tier({ requires, fallback = null, children }) {
  const { hasTier, loading } = usePermissions();
  
  if (loading) return null;
  
  return hasTier(requires) ? children : fallback;
}

