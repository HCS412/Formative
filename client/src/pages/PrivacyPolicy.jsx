import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'

export function PrivacyPolicy() {
  const lastUpdated = 'January 3, 2025'
  const effectiveDate = 'January 3, 2025'

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-[var(--text-secondary)]">
            Last Updated: {lastUpdated} | Effective Date: {effectiveDate}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none space-y-8">

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">1. Introduction</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>
                Formative ("Company," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, mobile applications, and related services (collectively, the "Platform" or "Services").
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using our Platform, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with our policies and practices, please do not use our Platform.
              </p>
              <p>
                This Privacy Policy applies to all users of our Platform, including Influencers/Creators, Brands, and Freelancers.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">2. Information We Collect</h2>
            <div className="text-[var(--text-secondary)] space-y-4">

              <h3 className="text-xl font-medium text-[var(--text-primary)]">2.1 Information You Provide Directly</h3>
              <p>We collect information you provide when you:</p>

              <h4 className="text-lg font-medium text-[var(--text-primary)] mt-4">Account Registration</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full name</li>
                <li>Email address</li>
                <li>Password (stored in hashed form)</li>
                <li>Account type (Influencer, Brand, Freelancer)</li>
                <li>Username</li>
              </ul>

              <h4 className="text-lg font-medium text-[var(--text-primary)] mt-4">Profile Information</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Profile photo/avatar</li>
                <li>Bio and description</li>
                <li>Location (city, country)</li>
                <li>Website URL</li>
                <li>Industry/niche categories</li>
                <li>Skills and expertise</li>
                <li>Portfolio samples</li>
                <li>Company name (for Brands)</li>
                <li>Social media handles</li>
              </ul>

              <h4 className="text-lg font-medium text-[var(--text-primary)] mt-4">Financial Information</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment method details (processed by Stripe)</li>
                <li>Bank account information (for payouts)</li>
                <li>Cryptocurrency wallet addresses</li>
                <li>Billing address</li>
                <li>Transaction history</li>
                <li>Tax identification numbers (where required)</li>
              </ul>

              <h4 className="text-lg font-medium text-[var(--text-primary)] mt-4">Communication Data</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Messages sent through the Platform</li>
                <li>Campaign collaboration communications</li>
                <li>Customer support inquiries</li>
                <li>Feedback and survey responses</li>
              </ul>

              <h4 className="text-lg font-medium text-[var(--text-primary)] mt-4">Content Data</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Campaign content and deliverables</li>
                <li>Digital products uploaded to shops</li>
                <li>Media kit information</li>
                <li>UTM links created</li>
                <li>Reviews and ratings</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">2.2 Information from Third-Party Services</h3>
              <p>When you connect third-party accounts, we receive:</p>

              <h4 className="text-lg font-medium text-[var(--text-primary)] mt-4">Social Media Platforms (Twitter/X, Instagram, TikTok, YouTube)</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account ID and username</li>
                <li>Profile information (name, bio, profile picture)</li>
                <li>Follower/subscriber counts</li>
                <li>Engagement metrics (likes, comments, shares, views)</li>
                <li>Content performance data</li>
                <li>Account verification status</li>
                <li>OAuth access tokens (stored encrypted)</li>
              </ul>

              <h4 className="text-lg font-medium text-[var(--text-primary)] mt-4">Payment Processors</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Stripe account information</li>
                <li>Payment confirmation details</li>
                <li>Payout status</li>
              </ul>

              <h4 className="text-lg font-medium text-[var(--text-primary)] mt-4">Cryptocurrency Services</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Wallet addresses</li>
                <li>Transaction hashes</li>
                <li>Smart contract interaction data</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">2.3 Information Collected Automatically</h3>
              <p>When you use our Platform, we automatically collect:</p>

              <h4 className="text-lg font-medium text-[var(--text-primary)] mt-4">Device and Technical Information</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Device type and identifiers</li>
                <li>Screen resolution</li>
                <li>Time zone</li>
                <li>Language preferences</li>
              </ul>

              <h4 className="text-lg font-medium text-[var(--text-primary)] mt-4">Usage Information</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pages visited and features used</li>
                <li>Time spent on pages</li>
                <li>Click patterns and navigation paths</li>
                <li>Search queries</li>
                <li>Referring URLs</li>
                <li>Access times and dates</li>
              </ul>

              <h4 className="text-lg font-medium text-[var(--text-primary)] mt-4">Cookies and Similar Technologies</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Session cookies (for authentication)</li>
                <li>Preference cookies (for settings)</li>
                <li>Analytics cookies (for understanding usage)</li>
                <li>Local storage data</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">3. How We Use Your Information</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>We use the information we collect for the following purposes:</p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">3.1 Providing and Operating the Platform</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Creating and managing your account</li>
                <li>Enabling connections between users</li>
                <li>Facilitating campaigns and collaborations</li>
                <li>Processing payments and payouts</li>
                <li>Operating the creator shop and marketplace</li>
                <li>Displaying social media metrics</li>
                <li>Providing messaging functionality</li>
                <li>Managing teams and permissions</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">3.2 Improving and Personalizing Services</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Analyzing usage patterns to improve features</li>
                <li>Personalizing content and recommendations</li>
                <li>Developing new features and services</li>
                <li>Conducting research and analytics</li>
                <li>A/B testing and optimization</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">3.3 Communication</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sending account-related notifications</li>
                <li>Providing customer support</li>
                <li>Sending marketing communications (with consent)</li>
                <li>Notifying you of policy changes</li>
                <li>Responding to your inquiries</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">3.4 Security and Compliance</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Protecting against fraud and abuse</li>
                <li>Enforcing our Terms of Service</li>
                <li>Complying with legal obligations</li>
                <li>Responding to legal requests</li>
                <li>Maintaining security logs and audit trails</li>
                <li>Investigating suspicious activity</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">3.5 Legal Bases for Processing (GDPR)</h3>
              <p>For users in the European Economic Area (EEA), we process your data based on:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[var(--text-primary)]">Contract Performance:</strong> Processing necessary to provide our services</li>
                <li><strong className="text-[var(--text-primary)]">Legitimate Interests:</strong> Improving services, preventing fraud, marketing</li>
                <li><strong className="text-[var(--text-primary)]">Legal Compliance:</strong> Meeting legal obligations</li>
                <li><strong className="text-[var(--text-primary)]">Consent:</strong> Where you have explicitly agreed</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">4. How We Share Your Information</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>We may share your information in the following circumstances:</p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">4.1 With Other Users</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[var(--text-primary)]">Profile Information:</strong> Your public profile is visible to other users</li>
                <li><strong className="text-[var(--text-primary)]">Media Kit:</strong> Public creator pages are accessible by URL</li>
                <li><strong className="text-[var(--text-primary)]">Shop Information:</strong> Public shop pages and products</li>
                <li><strong className="text-[var(--text-primary)]">Campaign Data:</strong> Shared with campaign collaborators</li>
                <li><strong className="text-[var(--text-primary)]">Team Data:</strong> Shared with team members</li>
                <li><strong className="text-[var(--text-primary)]">Messages:</strong> Visible to conversation participants</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">4.2 With Service Providers</h3>
              <p>We share data with third-party service providers who assist us:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[var(--text-primary)]">Stripe:</strong> Payment processing</li>
                <li><strong className="text-[var(--text-primary)]">Railway:</strong> Hosting and infrastructure</li>
                <li><strong className="text-[var(--text-primary)]">Cloud Storage Providers:</strong> File storage</li>
                <li><strong className="text-[var(--text-primary)]">Analytics Services:</strong> Usage analytics</li>
                <li><strong className="text-[var(--text-primary)]">Email Service Providers:</strong> Transactional emails</li>
                <li><strong className="text-[var(--text-primary)]">Security Services:</strong> Fraud prevention</li>
              </ul>
              <p className="mt-4">
                These providers are contractually obligated to protect your data and use it only for the services they provide to us.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">4.3 For Legal and Safety Reasons</h3>
              <p>We may disclose information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To comply with legal obligations or valid legal requests</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>To protect the rights, safety, or property of our users or others</li>
                <li>To detect, prevent, or address fraud, security, or technical issues</li>
                <li>In connection with legal proceedings</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">4.4 Business Transfers</h3>
              <p>
                If Formative is involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any change in ownership or control of your personal data.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">4.5 With Your Consent</h3>
              <p>
                We may share your information with third parties when you have given us explicit consent to do so.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">4.6 Aggregated and Anonymized Data</h3>
              <p>
                We may share aggregated or anonymized information that cannot reasonably be used to identify you for research, analysis, and other business purposes.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">5. Data Security</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>
                We implement robust security measures to protect your personal information:
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">5.1 Technical Safeguards</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[var(--text-primary)]">Encryption:</strong> Data encrypted in transit (TLS/SSL) and at rest</li>
                <li><strong className="text-[var(--text-primary)]">Password Security:</strong> Passwords hashed using bcrypt with strong salt</li>
                <li><strong className="text-[var(--text-primary)]">Token Encryption:</strong> OAuth tokens encrypted using AES-256-GCM</li>
                <li><strong className="text-[var(--text-primary)]">Two-Factor Authentication:</strong> Optional 2FA using TOTP</li>
                <li><strong className="text-[var(--text-primary)]">Security Headers:</strong> HSTS, CSP, X-Frame-Options, and other protective headers</li>
                <li><strong className="text-[var(--text-primary)]">Rate Limiting:</strong> Protection against brute force attacks</li>
                <li><strong className="text-[var(--text-primary)]">SQL Injection Prevention:</strong> Parameterized database queries</li>
                <li><strong className="text-[var(--text-primary)]">XSS Protection:</strong> Input sanitization and Content Security Policy</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">5.2 Organizational Safeguards</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access controls and principle of least privilege</li>
                <li>Regular security audits and assessments</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
                <li>Vendor security assessments</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">5.3 Account Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[var(--text-primary)]">Account Lockout:</strong> Automatic lockout after failed login attempts</li>
                <li><strong className="text-[var(--text-primary)]">Session Management:</strong> Automatic session timeout after inactivity</li>
                <li><strong className="text-[var(--text-primary)]">Audit Logging:</strong> Security events logged for monitoring</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">5.4 Your Responsibilities</h3>
              <p>You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining the confidentiality of your password</li>
                <li>Enabling two-factor authentication</li>
                <li>Notifying us immediately of unauthorized access</li>
                <li>Logging out of shared devices</li>
                <li>Using strong, unique passwords</li>
              </ul>

              <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-color)] mt-6">
                <p className="text-[var(--text-primary)] font-medium">Security Notice</p>
                <p className="mt-2">
                  While we implement strong security measures, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we are committed to protecting your data to the best of our ability.
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">6. Data Retention</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>We retain your information for as long as necessary to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide our services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Maintain business records</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">6.1 Retention Periods</h3>
              <table className="w-full mt-4 border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left py-3 text-[var(--text-primary)]">Data Type</th>
                    <th className="text-left py-3 text-[var(--text-primary)]">Retention Period</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-3">Account Information</td>
                    <td className="py-3">Duration of account + 30 days after deletion</td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-3">Transaction Records</td>
                    <td className="py-3">7 years (legal/tax requirements)</td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-3">Messages</td>
                    <td className="py-3">Duration of account + 90 days</td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-3">Campaign Data</td>
                    <td className="py-3">3 years after campaign completion</td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-3">Security/Audit Logs</td>
                    <td className="py-3">2 years</td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-3">Analytics Data</td>
                    <td className="py-3">26 months (anonymized thereafter)</td>
                  </tr>
                  <tr>
                    <td className="py-3">Cookies</td>
                    <td className="py-3">Varies by type (session to 1 year)</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">6.2 Account Deletion</h3>
              <p>
                When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law or for legitimate business purposes.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">7. Your Privacy Rights</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>Depending on your location, you may have the following rights regarding your personal data:</p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">7.1 General Rights (All Users)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[var(--text-primary)]">Access:</strong> Request a copy of your personal data</li>
                <li><strong className="text-[var(--text-primary)]">Correction:</strong> Update inaccurate or incomplete data</li>
                <li><strong className="text-[var(--text-primary)]">Deletion:</strong> Request deletion of your personal data</li>
                <li><strong className="text-[var(--text-primary)]">Portability:</strong> Receive your data in a portable format</li>
                <li><strong className="text-[var(--text-primary)]">Opt-Out:</strong> Unsubscribe from marketing communications</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">7.2 European Economic Area (EEA) Rights - GDPR</h3>
              <p>If you are in the EEA, you additionally have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[var(--text-primary)]">Restriction:</strong> Request restriction of processing</li>
                <li><strong className="text-[var(--text-primary)]">Objection:</strong> Object to processing based on legitimate interests</li>
                <li><strong className="text-[var(--text-primary)]">Withdraw Consent:</strong> Withdraw consent at any time</li>
                <li><strong className="text-[var(--text-primary)]">Lodge Complaint:</strong> File a complaint with your local data protection authority</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">7.3 California Rights - CCPA/CPRA</h3>
              <p>If you are a California resident, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[var(--text-primary)]">Know:</strong> What personal information we collect and how it's used</li>
                <li><strong className="text-[var(--text-primary)]">Delete:</strong> Request deletion of your personal information</li>
                <li><strong className="text-[var(--text-primary)]">Opt-Out:</strong> Opt out of the sale of personal information (we do not sell personal information)</li>
                <li><strong className="text-[var(--text-primary)]">Non-Discrimination:</strong> Not be discriminated against for exercising your rights</li>
                <li><strong className="text-[var(--text-primary)]">Correct:</strong> Request correction of inaccurate personal information</li>
                <li><strong className="text-[var(--text-primary)]">Limit:</strong> Limit use of sensitive personal information</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">7.4 UK Rights</h3>
              <p>
                If you are in the United Kingdom, you have similar rights to those under GDPR, enforceable under the UK GDPR and Data Protection Act 2018.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">7.5 Exercising Your Rights</h3>
              <p>To exercise your privacy rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the account settings in your dashboard</li>
                <li>Email us at <strong className="text-[var(--text-primary)]">privacy@formative.com</strong></li>
                <li>Submit a request through our support system</li>
              </ul>
              <p className="mt-4">
                We will respond to your request within 30 days (or as required by applicable law). We may need to verify your identity before processing certain requests.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">8. Cookies and Tracking Technologies</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <h3 className="text-xl font-medium text-[var(--text-primary)]">8.1 What Are Cookies</h3>
              <p>
                Cookies are small text files stored on your device when you visit our Platform. They help us provide and improve our services.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">8.2 Types of Cookies We Use</h3>
              <table className="w-full mt-4 border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left py-3 text-[var(--text-primary)]">Type</th>
                    <th className="text-left py-3 text-[var(--text-primary)]">Purpose</th>
                    <th className="text-left py-3 text-[var(--text-primary)]">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-3">Essential</td>
                    <td className="py-3">Authentication, security, basic functionality</td>
                    <td className="py-3">Session / 7-30 days</td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-3">Functional</td>
                    <td className="py-3">Remember preferences and settings</td>
                    <td className="py-3">1 year</td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-3">Analytics</td>
                    <td className="py-3">Understand usage patterns</td>
                    <td className="py-3">26 months</td>
                  </tr>
                  <tr>
                    <td className="py-3">Marketing</td>
                    <td className="py-3">Personalized content (with consent)</td>
                    <td className="py-3">1 year</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">8.3 Managing Cookies</h3>
              <p>You can manage cookies through:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your browser settings (block or delete cookies)</li>
                <li>Our cookie consent banner</li>
                <li>Platform settings</li>
              </ul>
              <p className="mt-4">
                Note: Disabling essential cookies may affect Platform functionality.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">8.4 Do Not Track</h3>
              <p>
                Some browsers have a "Do Not Track" feature. We currently do not respond to DNT signals, but you can manage tracking through the methods described above.
              </p>
            </div>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">9. International Data Transfers</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>
                Formative is based in the United States. If you access our Platform from outside the United States, your information may be transferred to, stored, and processed in the United States or other countries where our service providers operate.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">9.1 Transfer Mechanisms</h3>
              <p>For transfers from the EEA, UK, or Switzerland, we use appropriate safeguards:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                <li>Adequacy decisions where applicable</li>
                <li>Binding Corporate Rules (where applicable)</li>
                <li>Your explicit consent where required</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-4">9.2 Data Localization</h3>
              <p>
                While we primarily process data in the United States, we may use regional infrastructure to improve performance and comply with local requirements.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">10. Children's Privacy</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>
                Our Platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.
              </p>
              <p>
                If you are a parent or guardian and believe your child has provided us with personal information, please contact us at <strong className="text-[var(--text-primary)]">privacy@formative.com</strong>. We will take steps to delete such information.
              </p>
            </div>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">11. Third-Party Links and Services</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>
                Our Platform may contain links to third-party websites and services, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Social media platforms</li>
                <li>Payment processors</li>
                <li>Analytics providers</li>
                <li>External content</li>
              </ul>
              <p className="mt-4">
                This Privacy Policy does not apply to third-party services. We encourage you to review the privacy policies of any third-party services you access.
              </p>
            </div>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">12. Changes to This Privacy Policy</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>
                We may update this Privacy Policy from time to time. When we make changes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We will update the "Last Updated" date at the top</li>
                <li>For material changes, we will notify you via email or Platform notification</li>
                <li>We may provide a summary of changes</li>
              </ul>
              <p className="mt-4">
                Your continued use of the Platform after changes take effect constitutes acceptance of the revised Privacy Policy. We encourage you to review this policy periodically.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">13. Contact Us</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>

              <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-color)]">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Formative Privacy Team</h3>
                <ul className="space-y-2">
                  <li><strong className="text-[var(--text-primary)]">Email:</strong> privacy@formative.com</li>
                  <li><strong className="text-[var(--text-primary)]">General Support:</strong> support@formative.com</li>
                  <li><strong className="text-[var(--text-primary)]">Data Protection Officer:</strong> dpo@formative.com</li>
                </ul>
              </div>

              <p className="mt-4">
                For EEA residents, you may also contact your local data protection authority if you have concerns about our data practices.
              </p>
            </div>
          </section>

          {/* Specific Disclosures */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">14. Specific Jurisdiction Disclosures</h2>
            <div className="text-[var(--text-secondary)] space-y-4">

              <h3 className="text-xl font-medium text-[var(--text-primary)]">14.1 California Residents</h3>
              <p>
                Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[var(--text-primary)]">Sale of Personal Information:</strong> We do not sell your personal information to third parties.</li>
                <li><strong className="text-[var(--text-primary)]">Sharing for Advertising:</strong> We may share information with advertising partners. You can opt out.</li>
                <li><strong className="text-[var(--text-primary)]">Financial Incentives:</strong> We do not offer financial incentives for personal information.</li>
                <li><strong className="text-[var(--text-primary)]">Shine the Light:</strong> California residents may request information about disclosures to third parties for direct marketing.</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">14.2 Nevada Residents</h3>
              <p>
                Nevada residents may opt out of the sale of covered information. We do not currently sell covered information as defined under Nevada law.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">14.3 Virginia, Colorado, Connecticut, Utah Residents</h3>
              <p>
                Residents of these states have rights under their respective privacy laws (VCDPA, CPA, CTDPA, UCPA) similar to those described in Section 7. Contact us to exercise these rights.
              </p>
            </div>
          </section>

          {/* Summary */}
          <section className="border-t border-[var(--border-color)] pt-8 mt-12">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Summary of Key Points</h2>
            <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-color)]">
              <ul className="space-y-3 text-[var(--text-secondary)]">
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">✓</span>
                  <span>We collect information you provide and automatically through your use of the Platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">✓</span>
                  <span>We use your information to provide services, improve the Platform, and communicate with you</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">✓</span>
                  <span>We share information with other users (as you choose), service providers, and as required by law</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">✓</span>
                  <span>We implement strong security measures including encryption and 2FA</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">✓</span>
                  <span>You have rights to access, correct, delete, and port your data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">✓</span>
                  <span>We do not sell your personal information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">✓</span>
                  <span>Contact privacy@formative.com with any questions or concerns</span>
                </li>
              </ul>
            </div>
          </section>

        </div>

        {/* Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-[var(--border-color)] pt-8">
          <Link to="/terms" className="text-teal-400 hover:underline">
            ← View Terms of Service
          </Link>
          <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Back to Home →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-orange-500 relative">
              <div className="absolute w-5 h-5 rounded-full bg-[var(--bg-primary)] top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2" />
            </div>
            <span className="font-bold">Formative</span>
          </div>
          <p className="text-[var(--text-secondary)] text-sm">
            © 2025 Formative. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
