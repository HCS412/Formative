// Asset status lifecycle
const ASSET_STATUSES = [
  'draft',
  'in_review',
  'approved',
  'changes_requested',
  'scheduled',
  'live'
];

// Review outcome values
const REVIEW_OUTCOMES = [
  'approved',
  'changes_requested',
  'rejected'
];

// Feedback source types
const FEEDBACK_SOURCES = [
  'internal',
  'client',
  'creator',
  'qa',
  'system'
];

// Platform types for assets
const ASSET_PLATFORMS = [
  'instagram',
  'tiktok',
  'youtube',
  'twitter',
  'facebook',
  'linkedin',
  'bluesky',
  'threads'
];

// Asset format types
const ASSET_FORMATS = [
  'image',
  'video',
  'story',
  'reel',
  'carousel',
  'text',
  'audio'
];

module.exports = {
  ASSET_STATUSES,
  REVIEW_OUTCOMES,
  FEEDBACK_SOURCES,
  ASSET_PLATFORMS,
  ASSET_FORMATS
};
