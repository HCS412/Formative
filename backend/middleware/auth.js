// Authentication and Authorization Middleware
const jwt = require('jsonwebtoken');
const { EFFECTIVE_JWT_SECRET } = require('../config/security');
const pool = require('../config/database');

/**
 * Standard JWT authentication middleware
 * Requires Bearer token in Authorization header
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, EFFECTIVE_JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

/**
 * Flexible auth middleware - accepts token from query string or header
 * Useful for OAuth callbacks and redirect URLs
 */
const authenticateTokenFlexible = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Remove any accidental quotes around the token (URL decoded or literal)
  token = token.replace(/^["']|["']$/g, '');
  
  // Validate token format
  if (!token.startsWith('eyJ')) {
    return res.status(403).json({ error: 'Invalid token format. Please log in again.' });
  }

  jwt.verify(token, EFFECTIVE_JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
    }
    req.user = user;
    next();
  });
};

/**
 * Check if user has specific permission(s)
 * Usage: requirePermission('users:read', 'users:write')
 */
const requirePermission = (...requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      
      // Get user's permissions through their roles
      const result = await pool.query(`
        SELECT DISTINCT p.name 
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = $1
      `, [userId]);
      
      const userPermissions = result.rows.map(r => r.name);
      
      // Check if user has all required permissions
      const hasAllPermissions = requiredPermissions.every(perm => 
        userPermissions.includes(perm)
      );
      
      if (!hasAllPermissions) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          required: requiredPermissions,
          message: 'You do not have permission to perform this action'
        });
      }
      
      req.userPermissions = userPermissions;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Permission verification failed' });
    }
  };
};

/**
 * Check if user has specific role
 * Usage: requireRole('admin')
 */
const requireRole = (...requiredRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      
      // Get user's roles
      const result = await pool.query(`
        SELECT r.name 
        FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = $1
      `, [userId]);
      
      const userRoles = result.rows.map(r => r.name);
      
      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        return res.status(403).json({ 
          error: 'Insufficient role',
          required: requiredRoles,
          message: 'You do not have the required role to perform this action'
        });
      }
      
      req.userRoles = userRoles;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Role verification failed' });
    }
  };
};

/**
 * Check if user has specific team role
 * Usage: requireTeamRole('owner', 'admin')
 */
const requireTeamRole = (...requiredTeamRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const teamId = req.params.teamId || req.params.id || req.body.teamId;
      
      if (!teamId) {
        return res.status(400).json({ error: 'Team ID required' });
      }
      
      // Get user's role in the team
      const result = await pool.query(`
        SELECT role FROM team_members 
        WHERE team_id = $1 AND user_id = $2
      `, [teamId, userId]);
      
      if (result.rows.length === 0) {
        return res.status(403).json({ error: 'Not a member of this team' });
      }
      
      const teamRole = result.rows[0].role;
      
      if (!requiredTeamRoles.includes(teamRole)) {
        return res.status(403).json({ 
          error: 'Insufficient team role',
          required: requiredTeamRoles,
          current: teamRole
        });
      }
      
      req.teamRole = teamRole;
      next();
    } catch (error) {
      console.error('Team role check error:', error);
      res.status(500).json({ error: 'Team role verification failed' });
    }
  };
};

/**
 * Check if feature flag is enabled for user
 */
const requireFeatureFlag = (featureName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      
      // Check if feature is globally enabled
      const featureResult = await pool.query(`
        SELECT enabled, allowed_roles, allowed_user_ids 
        FROM feature_flags WHERE name = $1
      `, [featureName]);
      
      if (featureResult.rows.length === 0) {
        return res.status(404).json({ error: `Feature '${featureName}' not found` });
      }
      
      const feature = featureResult.rows[0];
      
      // If feature is globally disabled
      if (!feature.enabled) {
        return res.status(403).json({ 
          error: 'Feature not available',
          feature: featureName
        });
      }
      
      // Check if user is in allowed list
      if (feature.allowed_user_ids && feature.allowed_user_ids.length > 0) {
        if (!feature.allowed_user_ids.includes(userId)) {
          // Check roles if not in user list
          if (feature.allowed_roles && feature.allowed_roles.length > 0) {
            const userRoles = req.userRoles || [];
            const hasAllowedRole = feature.allowed_roles.some(r => userRoles.includes(r));
            if (!hasAllowedRole) {
              return res.status(403).json({ 
                error: 'Feature not available for your account',
                feature: featureName
              });
            }
          }
        }
      }
      
      next();
    } catch (error) {
      console.error('Feature flag check error:', error);
      res.status(500).json({ error: 'Feature check failed' });
    }
  };
};

module.exports = {
  authenticateToken,
  authenticateTokenFlexible,
  requirePermission,
  requireRole,
  requireTeamRole,
  requireFeatureFlag
};
