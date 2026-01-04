// Shared constants for asset lifecycle and reviews

const ASSET_STATUSES = [
  'draft',
  'in_review',
  'approved',
  'changes_requested',
  'scheduled',
  'live'
];

const REVIEW_OUTCOMES = [
  'approved',
  'changes_requested',
  'rejected'
];

module.exports = {
  ASSET_STATUSES,
  REVIEW_OUTCOMES
};
