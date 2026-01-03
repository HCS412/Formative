// Rate Limiting Middleware
const rateLimit = require('express-rate-limit');

// Helper to create rate limiters with consistent config
const createLimiter = (options) => rateLimit({
  standardHeaders: true,
  legacyHeaders: false,
  ...options
});

// ============================================
// GENERAL LIMITERS
// ============================================

// General API rate limiter
const generalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later' }
});

// ============================================
// AUTHENTICATION LIMITERS
// ============================================

// Strict rate limiter for auth endpoints (login, register)
const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  message: { error: 'Too many login attempts, please try again in 15 minutes' },
  skipSuccessfulRequests: true // Don't count successful logins
});

// Very strict limiter for password reset
const passwordResetLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: { error: 'Too many password reset attempts, please try again later' }
});

// 2FA verification limiter - prevent brute force on 6-digit codes
const twoFactorLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: { error: 'Too many 2FA attempts, please try again in 15 minutes' },
  skipSuccessfulRequests: true
});

// ============================================
// MESSAGING LIMITERS
// ============================================

// Message sending limiter - prevent spam
const messageLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute
  message: { error: 'Message rate limit exceeded, please slow down' }
});

// Conversation start limiter - prevent mass outreach spam
const conversationLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 new conversations per hour
  message: { error: 'Too many new conversations, please try again later' }
});

// ============================================
// TEAM/INVITE LIMITERS
// ============================================

// Team invite limiter - prevent invite spam
const inviteLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 invites per hour
  message: { error: 'Too many invites sent, please try again later' }
});

// Campaign invite limiter
const campaignInviteLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 campaign invites per hour
  message: { error: 'Too many campaign invites, please try again later' }
});

// ============================================
// SHOP/PAYMENT LIMITERS
// ============================================

// Checkout limiter - prevent payment abuse
const checkoutLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 checkout attempts per hour
  message: { error: 'Too many checkout attempts, please try again later' }
});

// Product creation limiter
const productLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 products per hour
  message: { error: 'Too many products created, please try again later' }
});

// Download limiter - prevent abuse
const downloadLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 downloads per minute
  message: { error: 'Too many download requests, please slow down' }
});

// ============================================
// APPLICATION/OPPORTUNITY LIMITERS
// ============================================

// Application limiter - prevent spam applications
const applicationLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 applications per hour
  message: { error: 'Too many applications submitted, please try again later' }
});

// Opportunity creation limiter
const opportunityLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 opportunities per hour
  message: { error: 'Too many opportunities created, please try again later' }
});

// ============================================
// SENSITIVE OPERATION LIMITERS
// ============================================

// Account modification limiter (username change, etc)
const accountModifyLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 modifications per hour
  message: { error: 'Too many account changes, please try again later' }
});

// Social account connection limiter
const socialConnectLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 connections per hour
  message: { error: 'Too many connection attempts, please try again later' }
});

// User search limiter
const searchLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: { error: 'Too many searches, please slow down' }
});

module.exports = {
  // General
  generalLimiter,
  // Auth
  authLimiter,
  passwordResetLimiter,
  twoFactorLimiter,
  // Messaging
  messageLimiter,
  conversationLimiter,
  // Teams/Invites
  inviteLimiter,
  campaignInviteLimiter,
  // Shop/Payment
  checkoutLimiter,
  productLimiter,
  downloadLimiter,
  // Opportunities
  applicationLimiter,
  opportunityLimiter,
  // Sensitive operations
  accountModifyLimiter,
  socialConnectLimiter,
  searchLimiter
};
