// Route index - exports all route modules
const authRoutes = require('./auth');
const assetRoutes = require('./assets');
const notificationRoutes = require('./notifications');

module.exports = {
  authRoutes,
  assetRoutes,
  notificationRoutes
};
