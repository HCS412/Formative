const webpush = require('web-push');

// Initialize web-push with VAPID keys
let pushEnabled = false;

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  pushEnabled = true;
  console.log('Web Push notifications enabled');
} else {
  console.log('Web Push notifications disabled (missing VAPID keys)');
}

/**
 * Send push notification to a specific user
 */
async function sendPushNotification(pool, userId, title, body, data = {}) {
  if (!pushEnabled) {
    return { success: false, sent: 0, error: 'Push notifications not configured' };
  }

  try {
    // Get all push subscriptions for the user
    const result = await pool.query(
      'SELECT * FROM push_subscriptions WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return { success: true, sent: 0, message: 'No push subscriptions found' };
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      tag: data.tag || `notification-${Date.now()}`,
      data: {
        url: data.url || '/dashboard/notifications',
        ...data
      },
      actions: data.actions || [
        { action: 'open', title: 'Open' },
        { action: 'dismiss', title: 'Dismiss' }
      ],
      timestamp: Date.now(),
      requireInteraction: data.requireInteraction || false,
    });

    let sent = 0;
    let failed = 0;
    const expiredSubscriptions = [];

    for (const subscription of result.rows) {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh_key,
          auth: subscription.auth_key,
        },
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);

        // Update last used timestamp
        await pool.query(
          'UPDATE push_subscriptions SET last_used_at = CURRENT_TIMESTAMP WHERE id = $1',
          [subscription.id]
        );

        sent++;
      } catch (error) {
        // Handle expired or invalid subscriptions
        if (error.statusCode === 410 || error.statusCode === 404) {
          expiredSubscriptions.push(subscription.id);
          console.log(`Push subscription expired: ${subscription.id}`);
        } else {
          console.error(`Push failed for subscription ${subscription.id}:`, error.message);
        }
        failed++;
      }
    }

    // Clean up expired subscriptions
    if (expiredSubscriptions.length > 0) {
      await pool.query(
        'DELETE FROM push_subscriptions WHERE id = ANY($1)',
        [expiredSubscriptions]
      );
      console.log(`Removed ${expiredSubscriptions.length} expired push subscriptions`);
    }

    return { success: true, sent, failed, total: result.rows.length };
  } catch (error) {
    console.error('Push notification error:', error);
    return { success: false, sent: 0, error: error.message };
  }
}

/**
 * Send push notification to multiple users
 */
async function sendPushToUsers(pool, userIds, title, body, data = {}) {
  if (!pushEnabled) {
    return { success: false, error: 'Push notifications not configured' };
  }

  const results = await Promise.all(
    userIds.map(userId => sendPushNotification(pool, userId, title, body, data))
  );

  const totalSent = results.reduce((sum, r) => sum + (r.sent || 0), 0);
  const totalFailed = results.reduce((sum, r) => sum + (r.failed || 0), 0);

  return {
    success: true,
    sent: totalSent,
    failed: totalFailed,
    users: userIds.length
  };
}

/**
 * Check if push notifications are enabled
 */
function isPushEnabled() {
  return pushEnabled;
}

/**
 * Get VAPID public key
 */
function getVapidPublicKey() {
  return process.env.VAPID_PUBLIC_KEY || null;
}

/**
 * Generate new VAPID keys (helper for setup)
 */
function generateVapidKeys() {
  const keys = webpush.generateVAPIDKeys();
  return {
    publicKey: keys.publicKey,
    privateKey: keys.privateKey,
    note: 'Add these to your environment variables as VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY'
  };
}

module.exports = {
  sendPushNotification,
  sendPushToUsers,
  isPushEnabled,
  getVapidPublicKey,
  generateVapidKeys,
};
