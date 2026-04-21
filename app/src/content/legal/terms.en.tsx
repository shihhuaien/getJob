export default function TermsEn() {
  return (
    <>
      <p className="text-base leading-7 text-gray-600">
        Welcome to Offery (&ldquo;the Service&rdquo;). Please read these Terms carefully before using the Service. By registering or using the Service, you acknowledge that you have read, understood, and agreed to be bound by these Terms.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">1. Service Description</h2>
      <p className="mt-3 text-base leading-7 text-gray-600">
        The Service is an AI-powered job search management platform offering job tracking, resume management, cover letter generation, AI resume optimization, interview simulation, and analytics. Features may be adjusted from time to time.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">2. Account</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-gray-600">
        <li>Provide a valid email address on registration</li>
        <li>You are responsible for safeguarding your password; do not share or transfer credentials</li>
        <li>You bear all liability arising from unauthorized use caused by leaked credentials</li>
        <li>You may deactivate or delete your account at any time from the settings page</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">3. Fees and Subscriptions</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-gray-600">
        <li>The Service offers a free plan and a Pro plan (US$9.99 / month)</li>
        <li>Pro is billed monthly via Stripe on a recurring basis</li>
        <li>You may cancel at any time; access continues until the end of the current billing period</li>
        <li>Fees already paid are non-refundable unless required by applicable law</li>
        <li>We reserve the right to adjust pricing with prior notice</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">4. Acceptable Use</h2>
      <p className="mt-3 text-base leading-7 text-gray-600">You agree not to:</p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-gray-600">
        <li>Upload unlawful, infringing or offensive content</li>
        <li>Use automated tools, crawlers, or bots to abuse the API</li>
        <li>Attempt to crack, reverse-engineer, or gain unauthorized access to the system</li>
        <li>Impersonate others or provide false information</li>
        <li>Violate the laws of the Republic of China (Taiwan) or the terms of third-party services (e.g. Stripe, Google)</li>
      </ul>
      <p className="mt-3 text-base leading-7 text-gray-600">
        Violations may result in immediate suspension or termination without prior notice. Fees and losses arising therefrom are non-refundable.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">5. Intellectual Property</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-gray-600">
        <li>Code, UI design, branding, and trademarks of the Service belong to the Service</li>
        <li>User-created original content (resumes, cover letters) remains owned by the user</li>
        <li>You grant the Service the rights necessary to store, process, and display your content for the purpose of operating the Service</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">6. AI Output Disclaimer</h2>
      <p className="mt-3 text-base leading-7 text-gray-600">
        The Service uses large language models (Google Gemini) for AI-assisted features such as resume optimization, cover letter generation, and interview evaluation. AI output is for reference only and is not guaranteed to be accurate or suitable. You are responsible for reviewing AI output before relying on it.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">7. Availability and Limitation of Liability</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-gray-600">
        <li>The Service is provided &ldquo;as is&rdquo; without warranty of continuous availability, error-free operation, or fitness for a particular purpose</li>
        <li>Service disruptions caused by third parties (Supabase, Stripe, Google, Vercel) are addressed on a reasonable-efforts basis without liability for damages</li>
        <li>
          Except for intentional or grossly negligent conduct, total liability is capped at the fees actually paid by the user during the 12 months preceding the claim
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">8. Changes to Terms</h2>
      <p className="mt-3 text-base leading-7 text-gray-600">
        We may modify these Terms from time to time. Material changes will be announced in-product or via email, and the &ldquo;Last updated&rdquo; date on this page will be revised. Continued use constitutes acceptance.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">9. Governing Law and Jurisdiction</h2>
      <p className="mt-3 text-base leading-7 text-gray-600">
        These Terms are governed by the laws of the Republic of China (Taiwan). Any dispute arising from these Terms or the Service shall be submitted to the Taipei District Court as the court of first instance.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">10. Contact</h2>
      <p className="mt-3 text-base leading-7 text-gray-600">
        For questions about these Terms, email us at{" "}
        <a
          href="mailto:timshih@thdg.site"
          className="font-medium text-brand-600 hover:underline"
        >
          timshih@thdg.site
        </a>
        .
      </p>
    </>
  );
}
