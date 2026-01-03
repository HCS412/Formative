import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'

export function TermsOfService() {
  const lastUpdated = 'January 3, 2025'
  const effectiveDate = 'January 3, 2025'

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
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
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">1. Introduction and Acceptance of Terms</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>
                Welcome to Formative ("Company," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of the Formative platform, including our website, mobile applications, APIs, and all related services (collectively, the "Platform" or "Services").
              </p>
              <p>
                By accessing or using our Platform, creating an account, or clicking "I Agree" to these Terms, you ("User," "you," or "your") acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy, which is incorporated herein by reference.
              </p>
              <p>
                <strong className="text-[var(--text-primary)]">IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT ACCESS OR USE THE PLATFORM.</strong>
              </p>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on the Platform and updating the "Last Updated" date. Your continued use of the Platform after such modifications constitutes your acceptance of the revised Terms.
              </p>
            </div>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">2. Eligibility and Account Registration</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <h3 className="text-xl font-medium text-[var(--text-primary)]">2.1 Eligibility Requirements</h3>
              <p>To use the Platform, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years of age or the age of majority in your jurisdiction, whichever is higher</li>
                <li>Have the legal capacity to enter into a binding contract</li>
                <li>Not be prohibited from using the Platform under applicable laws</li>
                <li>Not have been previously banned or removed from the Platform</li>
                <li>If registering on behalf of a business entity, have the authority to bind that entity to these Terms</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">2.2 Account Registration</h3>
              <p>When creating an account, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and accept responsibility for all activities under your account</li>
                <li>Immediately notify us of any unauthorized use of your account</li>
                <li>Not create multiple accounts for deceptive purposes</li>
                <li>Not share your account credentials with any third party</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">2.3 Account Types</h3>
              <p>The Platform offers different account types:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[var(--text-primary)]">Influencer/Creator Accounts:</strong> For individuals who create content and seek brand partnerships</li>
                <li><strong className="text-[var(--text-primary)]">Brand Accounts:</strong> For businesses seeking to collaborate with creators</li>
                <li><strong className="text-[var(--text-primary)]">Freelancer Accounts:</strong> For service providers offering professional services</li>
              </ul>
              <p className="mt-4">
                You may only maintain one account per account type unless expressly authorized by Formative.
              </p>
            </div>
          </section>

          {/* Platform Services */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">3. Platform Services</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <h3 className="text-xl font-medium text-[var(--text-primary)]">3.1 Description of Services</h3>
              <p>Formative provides a platform that enables:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Connection between brands, influencers, and freelancers for marketing collaborations</li>
                <li>Campaign creation, management, and tracking</li>
                <li>Marketplace for opportunities and services</li>
                <li>Communication tools between users</li>
                <li>Payment processing and escrow services</li>
                <li>Analytics and performance tracking</li>
                <li>Digital product sales through creator shops</li>
                <li>Team collaboration features</li>
                <li>Social media account integration and analytics</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">3.2 Platform Role</h3>
              <p>
                Formative acts as an intermediary platform connecting users. We do not employ influencers or freelancers, nor do we act as an agency for brands. We are not a party to agreements made between users through our Platform, except as specifically stated in these Terms.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">3.3 Service Availability</h3>
              <p>
                We strive to maintain Platform availability but do not guarantee uninterrupted access. We may modify, suspend, or discontinue any aspect of the Services at any time without liability. Scheduled maintenance will be communicated in advance when possible.
              </p>
            </div>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">4. User Conduct and Responsibilities</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <h3 className="text-xl font-medium text-[var(--text-primary)]">4.1 Acceptable Use</h3>
              <p>You agree to use the Platform only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable federal, state, local, or international law or regulation</li>
                <li>Engage in any fraudulent, deceptive, or misleading activity</li>
                <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation</li>
                <li>Infringe upon intellectual property rights of others</li>
                <li>Harass, abuse, threaten, or intimidate other users</li>
                <li>Post or transmit unlawful, harmful, threatening, abusive, defamatory, or obscene content</li>
                <li>Engage in any activity that could damage, disable, or impair the Platform</li>
                <li>Attempt to gain unauthorized access to any portion of the Platform</li>
                <li>Use automated systems (bots, scrapers) without authorization</li>
                <li>Circumvent any security measures or access controls</li>
                <li>Collect or store personal data about other users without consent</li>
                <li>Use the Platform for any purpose other than its intended use</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">4.2 Influencer/Creator Responsibilities</h3>
              <p>If you are an Influencer or Creator, you additionally agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate information about your social media following and engagement metrics</li>
                <li>Not artificially inflate followers, engagement, or other metrics through bots or purchased followers</li>
                <li>Comply with FTC Guidelines and other applicable advertising disclosure requirements</li>
                <li>Clearly disclose sponsored content as required by law (using #ad, #sponsored, or similar)</li>
                <li>Deliver agreed-upon content by specified deadlines</li>
                <li>Not engage in brand disparagement or competitive conflicts without disclosure</li>
                <li>Maintain the authenticity and integrity of your content</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">4.3 Brand Responsibilities</h3>
              <p>If you are a Brand, you additionally agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate campaign briefs and requirements</li>
                <li>Make timely payments for completed work</li>
                <li>Not request content that violates laws or platform policies</li>
                <li>Respect creators' creative autonomy as agreed</li>
                <li>Provide necessary assets and approvals in a timely manner</li>
                <li>Not use creator content beyond the agreed scope without permission</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">4.4 Freelancer Responsibilities</h3>
              <p>If you are a Freelancer, you additionally agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accurately represent your skills, experience, and portfolio</li>
                <li>Deliver services as described and agreed upon</li>
                <li>Meet agreed-upon deadlines and milestones</li>
                <li>Communicate professionally and responsively</li>
                <li>Maintain confidentiality of client information</li>
              </ul>
            </div>
          </section>

          {/* Content */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">5. Content and Intellectual Property</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <h3 className="text-xl font-medium text-[var(--text-primary)]">5.1 User Content</h3>
              <p>
                "User Content" includes any content you post, upload, or transmit through the Platform, including profile information, messages, campaign content, digital products, and any other materials.
              </p>
              <p>You represent and warrant that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You own or have the necessary rights to your User Content</li>
                <li>Your User Content does not infringe any third-party rights</li>
                <li>Your User Content complies with all applicable laws</li>
                <li>Your User Content is accurate and not misleading</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">5.2 License to User Content</h3>
              <p>
                By posting User Content, you grant Formative a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, modify, display, and distribute your User Content solely for the purposes of operating and improving the Platform. This license does not grant us ownership of your content.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">5.3 Content Between Users</h3>
              <p>
                Content rights between users (e.g., campaign content created by influencers for brands) are governed by the specific agreements between those users. Formative is not a party to such agreements unless explicitly stated.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">5.4 Formative Intellectual Property</h3>
              <p>
                The Platform, including its design, features, functionality, trademarks, logos, and all related intellectual property, is owned by Formative and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">5.5 DMCA and Copyright Infringement</h3>
              <p>
                We respect intellectual property rights. If you believe content on the Platform infringes your copyright, please submit a DMCA notice to our designated agent at: <strong className="text-[var(--text-primary)]">legal@formative.com</strong>
              </p>
              <p>Your notice must include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Identification of the copyrighted work claimed to be infringed</li>
                <li>Identification of the infringing material and its location</li>
                <li>Your contact information</li>
                <li>A statement of good faith belief that the use is not authorized</li>
                <li>A statement of accuracy and authority under penalty of perjury</li>
                <li>Your physical or electronic signature</li>
              </ul>
            </div>
          </section>

          {/* Payments */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">6. Payments, Fees, and Transactions</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <h3 className="text-xl font-medium text-[var(--text-primary)]">6.1 Platform Fees</h3>
              <p>Formative charges fees for certain services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[var(--text-primary)]">Transaction Fee:</strong> A percentage fee on completed transactions (currently 8% for shop sales)</li>
                <li><strong className="text-[var(--text-primary)]">Campaign Escrow Fee:</strong> A percentage fee on campaign payments processed through our escrow system (currently 5%)</li>
                <li><strong className="text-[var(--text-primary)]">Subscription Fees:</strong> Monthly or annual fees for premium features</li>
              </ul>
              <p className="mt-4">
                Fees are subject to change with 30 days' notice. Current fees are displayed at the time of transaction.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">6.2 Payment Processing</h3>
              <p>
                Payments are processed through our third-party payment processors (Stripe for fiat currency, blockchain networks for cryptocurrency). By using our payment services, you agree to the terms and conditions of these payment processors.
              </p>
              <p>
                You are responsible for all applicable taxes related to your transactions on the Platform.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">6.3 Escrow Services</h3>
              <p>
                For certain transactions, Formative offers escrow services where payment is held until deliverables are approved. Escrow terms are:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Funds are held in escrow until the brand approves deliverables</li>
                <li>Creators can claim funds if brands fail to respond within the agreed timeframe</li>
                <li>Disputes are subject to our dispute resolution process</li>
                <li>Escrow fees are non-refundable once a campaign is created</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">6.4 Smart Contract Escrow</h3>
              <p>
                For cryptocurrency transactions, we utilize smart contract escrow on supported blockchain networks. By using smart contract escrow, you acknowledge:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Blockchain transactions are irreversible once confirmed</li>
                <li>You are responsible for gas fees and network costs</li>
                <li>Smart contract interactions carry inherent technical risks</li>
                <li>We are not responsible for losses due to smart contract vulnerabilities or user error</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">6.5 Refunds</h3>
              <p>
                Refund policies vary by transaction type:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[var(--text-primary)]">Subscription Fees:</strong> Pro-rated refunds available within 30 days of purchase</li>
                <li><strong className="text-[var(--text-primary)]">Campaign Escrow:</strong> Subject to our dispute resolution process</li>
                <li><strong className="text-[var(--text-primary)]">Digital Products:</strong> Generally non-refundable due to the nature of digital goods, unless otherwise stated by the seller</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">6.6 Currency</h3>
              <p>
                All prices and fees are displayed in USD unless otherwise specified. For cryptocurrency transactions, equivalent values are calculated at the time of transaction.
              </p>
            </div>
          </section>

          {/* Subscriptions */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">7. Subscription Plans</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <h3 className="text-xl font-medium text-[var(--text-primary)]">7.1 Subscription Tiers</h3>
              <p>Formative offers the following subscription tiers:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[var(--text-primary)]">Free:</strong> Basic access with limited features</li>
                <li><strong className="text-[var(--text-primary)]">Starter ($19/month):</strong> Enhanced features for growing users</li>
                <li><strong className="text-[var(--text-primary)]">Pro ($49/month):</strong> Full feature access including team features and API access</li>
                <li><strong className="text-[var(--text-primary)]">Enterprise:</strong> Custom pricing with dedicated support and custom features</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">7.2 Billing</h3>
              <p>
                Subscriptions are billed in advance on a monthly or annual basis. Your subscription will automatically renew unless cancelled before the renewal date.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">7.3 Cancellation</h3>
              <p>
                You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing period. No refunds are provided for partial billing periods.
              </p>
            </div>
          </section>

          {/* Shop and Digital Products */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">8. Creator Shop and Digital Products</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <h3 className="text-xl font-medium text-[var(--text-primary)]">8.1 Selling Digital Products</h3>
              <p>Creators may sell digital products through their shop. As a seller, you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Are solely responsible for the products you list and sell</li>
                <li>Must accurately describe your products</li>
                <li>Must have all necessary rights to sell the products</li>
                <li>Are responsible for customer support related to your products</li>
                <li>Must comply with all applicable tax laws</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">8.2 Purchasing Digital Products</h3>
              <p>As a buyer, you acknowledge:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Digital products are typically non-refundable</li>
                <li>You receive a license to use the product, not ownership</li>
                <li>You may not redistribute or resell products without authorization</li>
                <li>Download links may have expiration times or limits</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">8.3 Prohibited Products</h3>
              <p>You may not sell products that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Infringe intellectual property rights</li>
                <li>Contain malware or harmful code</li>
                <li>Are illegal in any jurisdiction</li>
                <li>Contain adult or explicit content without proper restrictions</li>
                <li>Promote violence, hate, or discrimination</li>
                <li>Violate any third-party rights</li>
              </ul>
            </div>
          </section>

          {/* Social Media Integration */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">9. Social Media Integration</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <h3 className="text-xl font-medium text-[var(--text-primary)]">9.1 Account Linking</h3>
              <p>
                You may connect third-party social media accounts (Twitter/X, Instagram, TikTok, YouTube) to the Platform. By doing so, you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Authorize us to access account information as permitted by the platform</li>
                <li>Agree to the terms of service of those platforms</li>
                <li>Acknowledge that we may display your public profile information and metrics</li>
                <li>Understand that we securely store access tokens with encryption</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">9.2 Data Accuracy</h3>
              <p>
                While we strive to display accurate social media metrics, we cannot guarantee real-time accuracy. Metrics are updated periodically and may differ from live platform data.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">9.3 Disconnecting Accounts</h3>
              <p>
                You may disconnect linked social media accounts at any time through your settings. Disconnection does not delete historical data already collected.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">10. Privacy and Data Protection</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our <Link to="/privacy" className="text-teal-400 hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.
              </p>
              <p>
                By using the Platform, you consent to the collection and use of your information as described in our Privacy Policy.
              </p>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">11. Disclaimers and Limitations of Liability</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <h3 className="text-xl font-medium text-[var(--text-primary)]">11.1 Disclaimer of Warranties</h3>
              <p className="uppercase font-medium">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
              </p>
              <p>We do not warrant that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Platform will meet your specific requirements</li>
                <li>The Platform will be uninterrupted, timely, secure, or error-free</li>
                <li>Results obtained from the Platform will be accurate or reliable</li>
                <li>Any errors will be corrected</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">11.2 Limitation of Liability</h3>
              <p className="uppercase font-medium">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FORMATIVE AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Your access to or use of (or inability to access or use) the Platform</li>
                <li>Any conduct or content of any third party on the Platform</li>
                <li>Any content obtained from the Platform</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                <li>Smart contract execution or blockchain transactions</li>
                <li>Actions or inactions of other users</li>
              </ul>
              <p className="mt-4 uppercase font-medium">
                IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100).
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">11.3 Third-Party Services</h3>
              <p>
                The Platform may contain links to or integrations with third-party services (payment processors, social media platforms, etc.). We are not responsible for the content, privacy policies, or practices of these third parties. Your interactions with third-party services are governed by their respective terms.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">12. Indemnification</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>
                You agree to indemnify, defend, and hold harmless Formative and its officers, directors, employees, agents, licensors, and suppliers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your violation of these Terms</li>
                <li>Your User Content</li>
                <li>Your use of the Platform</li>
                <li>Your violation of any third-party rights</li>
                <li>Your violation of any applicable law or regulation</li>
                <li>Any dispute between you and another user</li>
              </ul>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">13. Dispute Resolution</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <h3 className="text-xl font-medium text-[var(--text-primary)]">13.1 User-to-User Disputes</h3>
              <p>
                For disputes between users (e.g., campaign disputes, payment issues), we encourage direct resolution. If unable to resolve directly, users may submit disputes to Formative for mediation. Our decision in such matters is final and binding.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">13.2 Disputes with Formative</h3>
              <p>
                <strong className="text-[var(--text-primary)]">Informal Resolution:</strong> Before filing any formal legal claim, you agree to contact us at <strong>legal@formative.com</strong> and attempt to resolve the dispute informally for at least 30 days.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">13.3 Arbitration Agreement</h3>
              <p className="uppercase font-medium">
                PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT.
              </p>
              <p className="mt-4">
                You and Formative agree that any dispute, claim, or controversy arising out of or relating to these Terms or the Platform will be settled by binding arbitration, rather than in court, except that either party may seek equitable relief in court for infringement of intellectual property rights.
              </p>
              <p className="mt-4">
                Arbitration will be conducted by JAMS under its applicable rules. The arbitration will be held in Delaware or another mutually agreed location. The arbitrator's decision will be final and binding.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">13.4 Class Action Waiver</h3>
              <p className="uppercase font-medium">
                YOU AND FORMATIVE AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE ACTION.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">13.5 Governing Law</h3>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">14. Termination</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <h3 className="text-xl font-medium text-[var(--text-primary)]">14.1 Termination by You</h3>
              <p>
                You may terminate your account at any time by contacting us or using the account deletion feature in settings. Upon termination, you remain responsible for any outstanding obligations.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">14.2 Termination by Us</h3>
              <p>We may suspend or terminate your account immediately, without prior notice, if:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You breach these Terms</li>
                <li>We are required to do so by law</li>
                <li>We reasonably believe your conduct is harmful to other users or Formative</li>
                <li>Your account has been inactive for an extended period</li>
                <li>You engage in fraudulent or illegal activity</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">14.3 Effect of Termination</h3>
              <p>Upon termination:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your right to use the Platform immediately ceases</li>
                <li>We may delete your account and data (subject to legal retention requirements)</li>
                <li>Any pending payments will be processed according to our policies</li>
                <li>Provisions that by their nature should survive termination shall survive</li>
              </ul>
            </div>
          </section>

          {/* General Provisions */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">15. General Provisions</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <h3 className="text-xl font-medium text-[var(--text-primary)]">15.1 Entire Agreement</h3>
              <p>
                These Terms, together with the Privacy Policy and any other legal notices published on the Platform, constitute the entire agreement between you and Formative regarding the Platform.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">15.2 Severability</h3>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">15.3 Waiver</h3>
              <p>
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of such right or provision.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">15.4 Assignment</h3>
              <p>
                You may not assign or transfer these Terms without our prior written consent. We may assign or transfer these Terms without restriction.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">15.5 Force Majeure</h3>
              <p>
                We will not be liable for any failure or delay in performance resulting from causes beyond our reasonable control, including acts of God, war, terrorism, strikes, natural disasters, or internet outages.
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">15.6 Notices</h3>
              <p>
                We may provide notices to you via email, posting on the Platform, or other reasonable means. You may contact us at:
              </p>
              <p className="mt-2">
                <strong className="text-[var(--text-primary)]">Formative</strong><br />
                Email: legal@formative.com
              </p>

              <h3 className="text-xl font-medium text-[var(--text-primary)] mt-6">15.7 Relationship of Parties</h3>
              <p>
                Nothing in these Terms creates a partnership, joint venture, employment, or agency relationship between you and Formative. Users are independent contractors.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">16. Contact Information</h2>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none space-y-2">
                <li><strong className="text-[var(--text-primary)]">Email:</strong> legal@formative.com</li>
                <li><strong className="text-[var(--text-primary)]">Support:</strong> support@formative.com</li>
              </ul>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="border-t border-[var(--border-color)] pt-8 mt-12">
            <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-color)]">
              <p className="text-[var(--text-secondary)]">
                By using Formative, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these Terms, you must not use the Platform.
              </p>
            </div>
          </section>

        </div>

        {/* Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-[var(--border-color)] pt-8">
          <Link to="/privacy" className="text-teal-400 hover:underline">
            View Privacy Policy →
          </Link>
          <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            ← Back to Home
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
