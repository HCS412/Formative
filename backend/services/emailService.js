const { Resend } = require('resend');

// Initialize Resend client
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'Formative <notifications@formativeunites.us>';
const APP_URL = process.env.APP_URL || 'https://formativeunites.us';

// Email templates
const EMAIL_TEMPLATES = {
  message_received: {
    subject: (data) => `New message from ${data.senderName || 'someone'}`,
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #0d9488 0%, #7c3aed 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Message</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px;">
              <strong>${data.senderName || 'Someone'}</strong> sent you a message:
            </p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #0d9488; margin-bottom: 20px;">
              <p style="margin: 0; color: #555; font-style: italic;">${data.preview || 'Click below to read the message'}</p>
            </div>
            <a href="${data.actionUrl || APP_URL + '/dashboard/messages'}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">View Message</a>
          </div>
          <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            You received this email because you have notifications enabled on Formative.
            <br><a href="${APP_URL}/dashboard/settings" style="color: #0d9488;">Manage preferences</a>
          </p>
        </div>
      </body>
      </html>
    `,
  },

  payment_received: {
    subject: (data) => `Payment received: $${data.amount}`,
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #0d9488 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Payment Received!</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
              <p style="font-size: 48px; font-weight: bold; color: #10b981; margin: 0;">$${data.amount}</p>
              <p style="color: #666; margin: 5px 0 0;">has been added to your account</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #666; padding: 5px 0;">From</td>
                  <td style="text-align: right; font-weight: 500;">${data.payerName || 'N/A'}</td>
                </tr>
                ${data.campaignName ? `
                <tr>
                  <td style="color: #666; padding: 5px 0;">Campaign</td>
                  <td style="text-align: right; font-weight: 500;">${data.campaignName}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="color: #666; padding: 5px 0;">Date</td>
                  <td style="text-align: right; font-weight: 500;">${new Date().toLocaleDateString()}</td>
                </tr>
              </table>
            </div>
            <a href="${data.actionUrl || APP_URL + '/dashboard/payments'}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">View Payment</a>
          </div>
          <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            <a href="${APP_URL}/dashboard/settings" style="color: #0d9488;">Manage notification preferences</a>
          </p>
        </div>
      </body>
      </html>
    `,
  },

  milestone_missed: {
    subject: (data) => `Deadline passed: ${data.milestoneName || 'Milestone'}`,
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Deadline Passed</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px;">
              The deadline for <strong>"${data.milestoneName || 'a milestone'}"</strong> has passed.
            </p>
            ${data.campaignName ? `
            <p style="color: #666; margin: 0 0 20px;">
              Campaign: <strong>${data.campaignName}</strong>
            </p>
            ` : ''}
            <a href="${data.actionUrl || APP_URL + '/dashboard/campaigns'}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">View Campaign</a>
          </div>
          <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            <a href="${APP_URL}/dashboard/settings" style="color: #0d9488;">Manage notification preferences</a>
          </p>
        </div>
      </body>
      </html>
    `,
  },

  deliverable_due_soon: {
    subject: (data) => `Reminder: ${data.deliverableName || 'Deliverable'} due ${data.dueDate || 'soon'}`,
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Upcoming Deadline</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px;">
              Your deliverable <strong>"${data.deliverableName || 'Deliverable'}"</strong> is due <strong>${data.dueDate || 'soon'}</strong>.
            </p>
            ${data.campaignName ? `
            <p style="color: #666; margin: 0 0 20px;">
              Campaign: <strong>${data.campaignName}</strong>
            </p>
            ` : ''}
            <a href="${data.actionUrl || APP_URL + '/dashboard/campaigns'}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">Submit Deliverable</a>
          </div>
          <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            <a href="${APP_URL}/dashboard/settings" style="color: #0d9488;">Manage notification preferences</a>
          </p>
        </div>
      </body>
      </html>
    `,
  },

  file_uploaded: {
    subject: (data) => `New file uploaded: ${data.fileName || 'File'}`,
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New File Uploaded</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px;">
              <strong>${data.uploaderName || 'Someone'}</strong> uploaded a file: <strong>${data.fileName || 'File'}</strong>
            </p>
            ${data.assetName ? `
            <p style="color: #666; margin: 0 0 20px;">
              Asset: <strong>${data.assetName}</strong>
            </p>
            ` : ''}
            <a href="${data.actionUrl || APP_URL + '/dashboard/assets'}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">View File</a>
          </div>
          <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            <a href="${APP_URL}/dashboard/settings" style="color: #0d9488;">Manage notification preferences</a>
          </p>
        </div>
      </body>
      </html>
    `,
  },

  // Generic notification template
  generic: {
    subject: (data) => data.subject || 'Notification from Formative',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #0d9488 0%, #7c3aed 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">${data.title || 'Notification'}</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px;">
              ${data.message || ''}
            </p>
            ${data.actionUrl ? `
            <a href="${data.actionUrl}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">${data.actionText || 'View Details'}</a>
            ` : ''}
          </div>
          <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            <a href="${APP_URL}/dashboard/settings" style="color: #0d9488;">Manage notification preferences</a>
          </p>
        </div>
      </body>
      </html>
    `,
  },
};

/**
 * Send email directly
 */
async function sendEmail(to, template, data) {
  if (!resend) {
    console.log('Email service not configured (missing RESEND_API_KEY)');
    return { success: false, error: 'Email service not configured' };
  }

  const templateConfig = EMAIL_TEMPLATES[template] || EMAIL_TEMPLATES.generic;

  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject: templateConfig.subject(data),
      html: templateConfig.html(data),
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, id: result.id };
  } catch (error) {
    console.error('Email send failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Queue email notification for later sending
 */
async function queueEmailNotification(pool, userId, type, title, message, data = {}) {
  try {
    // Get user email
    const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) return null;

    const email = userResult.rows[0].email;

    const result = await pool.query(`
      INSERT INTO email_queue (user_id, to_email, subject, template, template_data)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [userId, email, title, type, JSON.stringify({ ...data, message, title })]);

    return result.rows[0].id;
  } catch (error) {
    console.error('Failed to queue email:', error.message);
    return null;
  }
}

/**
 * Process email queue - call this periodically
 */
async function processEmailQueue(pool) {
  if (!resend) {
    return { processed: 0, message: 'Email service not configured' };
  }

  try {
    // Get pending emails (max 10 at a time, max 3 attempts)
    const result = await pool.query(`
      SELECT * FROM email_queue
      WHERE status = 'pending' AND attempts < 3
      ORDER BY created_at ASC
      LIMIT 10
    `);

    let processed = 0;
    let failed = 0;

    for (const email of result.rows) {
      try {
        const sendResult = await sendEmail(
          email.to_email,
          email.template,
          email.template_data
        );

        if (sendResult.success) {
          await pool.query(`
            UPDATE email_queue
            SET status = 'sent', sent_at = CURRENT_TIMESTAMP
            WHERE id = $1
          `, [email.id]);
          processed++;
        } else {
          throw new Error(sendResult.error);
        }
      } catch (error) {
        await pool.query(`
          UPDATE email_queue
          SET attempts = attempts + 1, last_attempt_at = CURRENT_TIMESTAMP, error_message = $1
          WHERE id = $2
        `, [error.message, email.id]);
        failed++;
      }
    }

    return { processed, failed, total: result.rows.length };
  } catch (error) {
    console.error('Email queue processing error:', error.message);
    return { processed: 0, failed: 0, error: error.message };
  }
}

/**
 * Start email queue processor (runs every minute)
 */
function startEmailQueueProcessor(pool) {
  if (!resend) {
    console.log('Email queue processor not started (missing RESEND_API_KEY)');
    return null;
  }

  console.log('Starting email queue processor...');

  const intervalId = setInterval(async () => {
    const result = await processEmailQueue(pool);
    if (result.processed > 0 || result.failed > 0) {
      console.log(`Email queue processed: ${result.processed} sent, ${result.failed} failed`);
    }
  }, 60000); // Every minute

  return intervalId;
}

module.exports = {
  sendEmail,
  queueEmailNotification,
  processEmailQueue,
  startEmailQueueProcessor,
  EMAIL_TEMPLATES,
  FROM_EMAIL,
};
