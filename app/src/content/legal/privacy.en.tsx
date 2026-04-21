export default function PrivacyEn() {
  return (
    <>
      <p className="text-base leading-7 text-gray-600">
        Offery (&ldquo;the Service&rdquo;) respects and is committed to protecting user privacy. This policy explains what data we collect, why we collect it, how it is used, and the rights you have over your personal data. By using the Service, you agree to this policy.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">1. Data We Collect</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-gray-600">
        <li>Account info: email, name, Google OAuth identifier (if you sign in with Google)</li>
        <li>User-created content: resumes, cover letters, job application records, interview practice data (text, audio, AI responses)</li>
        <li>Subscription info: Stripe Customer ID, subscription status and billing cycles (credit card data is handled by Stripe and is never stored by the Service)</li>
        <li>System identifiers: Supabase User ID, API tokens</li>
        <li>Usage logs: operation logs, error traces, IP addresses (used only for security and debugging)</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">2. Purposes</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-gray-600">
        <li>Provide core functionality: job tracking, AI resume optimization, interview simulation</li>
        <li>Process Pro subscription billing</li>
        <li>Maintain security, prevent abuse, debug and improve the Service</li>
        <li>Respond to your account management requests (query, correction, deletion)</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">3. Third-Party Processors</h2>
      <p className="mt-3 text-base leading-7 text-gray-600">
        To deliver the Service, we share necessary data with the following processors. Each is bound by its own privacy policy:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-gray-600">
        <li>Supabase (US / Singapore): database, authentication, file storage</li>
        <li>Stripe (US): subscription billing and payment processing</li>
        <li>Google (US): OAuth sign-in</li>
        <li>Google Gemini API (US): AI resume optimization, cover letter generation, interview evaluation</li>
        <li>Vercel (global CDN): website hosting and deployment</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">4. Retention</h2>
      <p className="mt-3 text-base leading-7 text-gray-600">
        Data is retained while your account exists. When you delete your account, we will remove all personally identifiable data within 30 days, except where retention is required by law (such as subscription billing records).
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">5. Your Rights</h2>
      <p className="mt-3 text-base leading-7 text-gray-600">
        Under Article 3 of Taiwan&apos;s Personal Data Protection Act, you have the following rights. Most can be exercised directly from the settings page, or you may email us:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-gray-600">
        <li>Access and view your personal data</li>
        <li>Request a copy</li>
        <li>Request supplement or correction</li>
        <li>Request cessation of collection, processing or use</li>
        <li>Request deletion</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">6. Cookies</h2>
      <p className="mt-3 text-base leading-7 text-gray-600">
        The Service uses only essential session cookies (SameSite=Lax) to maintain sign-in state. No third-party tracking or behavioral analytics cookies are used.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">7. Security</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-gray-600">
        <li>HTTPS encryption for all traffic</li>
        <li>Row Level Security (RLS) on the database; users can access only their own data</li>
        <li>Stripe Webhook signature verification to prevent forged requests</li>
        <li>Passwords are stored as bcrypt hashes via Supabase Auth and cannot be recovered</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">8. Minors</h2>
      <p className="mt-3 text-base leading-7 text-gray-600">
        Users under 18 must obtain consent from a legal guardian. If you are a guardian and believe your child registered without consent, please contact us for account removal.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">9. Changes to This Policy</h2>
      <p className="mt-3 text-base leading-7 text-gray-600">
        Material changes will be announced in-product or via email, and the &ldquo;Last updated&rdquo; date on this page will be revised. Continued use after changes constitutes acceptance.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900">10. Contact</h2>
      <p className="mt-3 text-base leading-7 text-gray-600">
        For privacy questions, complaints, or to exercise your rights, email us at{" "}
        <a
          href="mailto:timshih@thdg.site"
          className="font-medium text-brand-600 hover:underline"
        >
          timshih@thdg.site
        </a>
        . We aim to respond within 30 days.
      </p>
    </>
  );
}
