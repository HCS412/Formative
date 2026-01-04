// Input Validation Schemas using express-validator
const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation result handler middleware
 * Use after validation chains to return errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// ============================================
// AUTH VALIDATORS
// ============================================

const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('userType')
    .trim()
    .notEmpty().withMessage('User type is required')
    .isIn(['influencer', 'brand', 'freelancer']).withMessage('Invalid user type'),
  handleValidationErrors
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const twoFactorCodeValidator = [
  body('code')
    .trim()
    .notEmpty().withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
    .isNumeric().withMessage('Code must be numeric'),
  handleValidationErrors
];

const twoFactorLoginValidator = [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isInt({ min: 1 }).withMessage('Invalid user ID format')
    .toInt(),
  body('code')
    .trim()
    .notEmpty().withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
    .isNumeric().withMessage('Code must be numeric'),
  body('rememberMe')
    .optional()
    .isBoolean().withMessage('Remember me must be a boolean'),
  handleValidationErrors
];

// ============================================
// USER PROFILE VALIDATORS
// ============================================

const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .escape(),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Bio must be under 1000 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Location must be under 255 characters')
    .escape(),
  body('website')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Website must be under 500 characters'),
  handleValidationErrors
];

const usernameValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores')
    .toLowerCase(),
  handleValidationErrors
];

const usernameCheckValidator = [
  param('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Invalid username format'),
  handleValidationErrors
];

// ============================================
// OPPORTUNITY VALIDATORS
// ============================================

const createOpportunityValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 255 }).withMessage('Title must be 5-255 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description must be under 5000 characters'),
  body('type')
    .trim()
    .notEmpty().withMessage('Type is required')
    .isIn(['sponsorship', 'ugc', 'affiliate', 'ambassador', 'collaboration', 'freelance', 'other'])
    .withMessage('Invalid opportunity type'),
  body('industry')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Industry must be under 100 characters')
    .escape(),
  body('budgetMin')
    .optional()
    .isInt({ min: 0 }).withMessage('Budget minimum must be a positive number'),
  body('budgetMax')
    .optional()
    .isInt({ min: 0 }).withMessage('Budget maximum must be a positive number'),
  body('deadline')
    .optional()
    .isISO8601().withMessage('Invalid deadline date format'),
  handleValidationErrors
];

const applyOpportunityValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid opportunity ID'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Message must be under 2000 characters'),
  body('proposedRate')
    .optional()
    .isInt({ min: 0, max: 10000000 }).withMessage('Proposed rate must be a valid amount'),
  handleValidationErrors
];

// ============================================
// MESSAGE VALIDATORS
// ============================================

const sendMessageValidator = [
  body('content')
    .trim()
    .notEmpty().withMessage('Message content is required')
    .isLength({ min: 1, max: 5000 }).withMessage('Message must be 1-5000 characters'),
  body('receiverId')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid receiver ID'),
  body('conversationId')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid conversation ID'),
  handleValidationErrors
];

const startConversationValidator = [
  body('userId')
    .isInt({ min: 1 }).withMessage('Invalid user ID'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Message must be under 5000 characters'),
  handleValidationErrors
];

// ============================================
// CAMPAIGN VALIDATORS
// ============================================

const createCampaignValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Campaign name is required')
    .isLength({ min: 3, max: 255 }).withMessage('Name must be 3-255 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description must be under 5000 characters'),
  body('budget')
    .optional()
    .isInt({ min: 0 }).withMessage('Budget must be a positive number'),
  body('startDate')
    .optional()
    .isISO8601().withMessage('Invalid start date format'),
  body('endDate')
    .optional()
    .isISO8601().withMessage('Invalid end date format'),
  handleValidationErrors
];

const updateCampaignValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid campaign ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('Name must be 3-255 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description must be under 5000 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'active', 'paused', 'completed', 'cancelled'])
    .withMessage('Invalid campaign status'),
  handleValidationErrors
];

const campaignInviteValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid campaign ID'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  handleValidationErrors
];

const campaignRespondValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid campaign ID'),
  body('accept')
    .isBoolean().withMessage('Accept must be true or false'),
  handleValidationErrors
];

const submitDeliverableValidator = [
  param('campaignId')
    .isInt({ min: 1 }).withMessage('Invalid campaign ID'),
  param('deliverableId')
    .isInt({ min: 1 }).withMessage('Invalid deliverable ID'),
  body('url')
    .optional()
    .trim()
    .isURL().withMessage('Invalid URL format'),
  body('content')
    .optional()
    .trim()
    .isLength({ max: 10000 }).withMessage('Content must be under 10000 characters'),
  body('caption')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Caption must be under 1000 characters'),
  body('files')
    .optional()
    .isArray({ min: 1 }).withMessage('Files must be an array'),
  body('files.*.type')
    .optional()
    .trim()
    .isLength({ min: 1 }).withMessage('File type is required'),
  body('files.*.size')
    .optional()
    .isInt({ min: 1 }).withMessage('File size must be greater than zero'),
  handleValidationErrors
];

const reviewDeliverableValidator = [
  param('campaignId')
    .isInt({ min: 1 }).withMessage('Invalid campaign ID'),
  param('deliverableId')
    .isInt({ min: 1 }).withMessage('Invalid deliverable ID'),
  body('status')
    .optional()
    .isIn(['approved', 'revision_requested', 'rejected'])
    .withMessage('Invalid status'),
  body('approve')
    .optional()
    .isBoolean().withMessage('Approve must be true or false'),
  body()
    .custom(body => {
      if (body.status || typeof body.approve === 'boolean') {
        return true;
      }
      throw new Error('Provide either status or approve flag');
    }),
  body('feedback')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Feedback must be under 2000 characters'),
  handleValidationErrors
];

// ============================================
// TEAM VALIDATORS
// ============================================

const createTeamValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Team name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be under 500 characters'),
  body('teamType')
    .optional()
    .isIn(['brand', 'agency', 'creator_collective'])
    .withMessage('Invalid team type'),
  handleValidationErrors
];

const updateTeamValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid team ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be under 500 characters'),
  handleValidationErrors
];

const teamInviteValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid team ID'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('roleId')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid role ID'),
  handleValidationErrors
];

const teamRespondValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid team ID'),
  body('accept')
    .isBoolean().withMessage('Accept must be true or false'),
  handleValidationErrors
];

const updateMemberRoleValidator = [
  param('teamId')
    .isInt({ min: 1 }).withMessage('Invalid team ID'),
  param('userId')
    .isInt({ min: 1 }).withMessage('Invalid user ID'),
  body('roleId')
    .isInt({ min: 1 }).withMessage('Role ID is required'),
  handleValidationErrors
];

// ============================================
// SHOP VALIDATORS
// ============================================

const updateShopSettingsValidator = [
  body('shopName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Shop name must be under 100 characters')
    .escape(),
  body('shopDescription')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must be under 1000 characters'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be true or false'),
  handleValidationErrors
];

const createProductValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Name must be 2-200 characters')
    .escape(),
  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Short description must be under 300 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 10000 }).withMessage('Description must be under 10000 characters'),
  body('type')
    .trim()
    .notEmpty().withMessage('Product type is required')
    .isIn(['digital', 'course', 'template', 'ebook', 'audio', 'video', 'other'])
    .withMessage('Invalid product type'),
  body('price')
    .isInt({ min: 0, max: 100000000 }).withMessage('Price must be a valid amount in cents'),
  body('compareAtPrice')
    .optional()
    .isInt({ min: 0, max: 100000000 }).withMessage('Compare price must be a valid amount'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be true or false'),
  handleValidationErrors
];

const updateProductValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid product ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Name must be 2-200 characters')
    .escape(),
  body('price')
    .optional()
    .isInt({ min: 0, max: 100000000 }).withMessage('Price must be a valid amount'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be true or false'),
  handleValidationErrors
];

const addProductFileValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid product ID'),
  body('fileName')
    .trim()
    .notEmpty().withMessage('File name is required')
    .isLength({ max: 255 }).withMessage('File name must be under 255 characters'),
  body('fileUrl')
    .trim()
    .notEmpty().withMessage('File URL is required')
    .isURL().withMessage('Invalid file URL'),
  body('fileSize')
    .optional()
    .isInt({ min: 0 }).withMessage('File size must be a positive number'),
  body('fileType')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('File type must be under 50 characters'),
  handleValidationErrors
];

const checkoutValidator = [
  param('productId')
    .isInt({ min: 1 }).withMessage('Invalid product ID'),
  body('customerEmail')
    .trim()
    .notEmpty().withMessage('Customer email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('customerName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters')
    .escape(),
  handleValidationErrors
];

// ============================================
// PAYMENT VALIDATORS
// ============================================

const addPaymentMethodValidator = [
  body('type')
    .trim()
    .notEmpty().withMessage('Payment type is required')
    .isIn(['stripe', 'crypto', 'bank'])
    .withMessage('Invalid payment type'),
  body('walletAddress')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Wallet address must be under 255 characters'),
  body('walletNetwork')
    .optional()
    .isIn(['ethereum', 'polygon', 'optimism', 'arbitrum', 'base'])
    .withMessage('Invalid wallet network'),
  handleValidationErrors
];

// ============================================
// ADMIN VALIDATORS
// ============================================

const assignRoleValidator = [
  param('userId')
    .isInt({ min: 1 }).withMessage('Invalid user ID'),
  body('roleId')
    .isInt({ min: 1 }).withMessage('Role ID is required'),
  handleValidationErrors
];

const updateFeatureFlagValidator = [
  param('name')
    .trim()
    .notEmpty().withMessage('Feature name is required')
    .isLength({ max: 100 }).withMessage('Feature name must be under 100 characters'),
  body('isEnabled')
    .optional()
    .isBoolean().withMessage('isEnabled must be true or false'),
  body('rolloutPercentage')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Rollout percentage must be 0-100'),
  handleValidationErrors
];

// ============================================
// NOTIFICATION VALIDATORS
// ============================================

const notificationIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid notification ID'),
  handleValidationErrors
];

// ============================================
// GENERIC ID VALIDATORS
// ============================================

const idParamValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid ID'),
  handleValidationErrors
];

const paginationValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('offset')
    .optional()
    .isInt({ min: 0 }).withMessage('Offset must be non-negative'),
  handleValidationErrors
];

// ============================================
// SOCIAL ACCOUNT VALIDATORS
// ============================================

const disconnectSocialValidator = [
  param('platform')
    .trim()
    .notEmpty().withMessage('Platform is required')
    .isIn(['twitter', 'instagram', 'tiktok', 'youtube', 'bluesky'])
    .withMessage('Invalid platform'),
  handleValidationErrors
];

const blueskyConnectValidator = [
  body('identifier')
    .trim()
    .notEmpty().withMessage('Bluesky handle is required')
    .isLength({ max: 100 }).withMessage('Handle must be under 100 characters'),
  body('password')
    .notEmpty().withMessage('App password is required'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  // Auth
  registerValidator,
  loginValidator,
  twoFactorCodeValidator,
  twoFactorLoginValidator,
  // User
  updateProfileValidator,
  usernameValidator,
  usernameCheckValidator,
  // Opportunity
  createOpportunityValidator,
  applyOpportunityValidator,
  // Message
  sendMessageValidator,
  startConversationValidator,
  // Campaign
  createCampaignValidator,
  updateCampaignValidator,
  campaignInviteValidator,
  campaignRespondValidator,
  submitDeliverableValidator,
  reviewDeliverableValidator,
  // Team
  createTeamValidator,
  updateTeamValidator,
  teamInviteValidator,
  teamRespondValidator,
  updateMemberRoleValidator,
  // Shop
  updateShopSettingsValidator,
  createProductValidator,
  updateProductValidator,
  addProductFileValidator,
  checkoutValidator,
  // Payment
  addPaymentMethodValidator,
  // Admin
  assignRoleValidator,
  updateFeatureFlagValidator,
  // Notification
  notificationIdValidator,
  // Generic
  idParamValidator,
  paginationValidator,
  // Social
  disconnectSocialValidator,
  blueskyConnectValidator
};
